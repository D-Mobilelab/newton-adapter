(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NewtonAdapter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var PROMISE_STATUS = {
    0: 'pending',
    1: 'fulfilled',
    2: 'rejected'
}

var PASS = function(arg){
    return arg;
}

var PrivatePromise = function(executor, nextProm, resolveMaxTimes){

    // executor called at the end of the definition of Promise
    if (typeof executor !== 'undefined' && typeof executor !== 'function'){
        throw 'PromiseLite :: executor must be a function, got ' + typeof executor;
    }
    
    var promiseInstance = this;
    var promiseStatusIndex = 0;
    var promiseValue;
    var promiseReason;
    var maxTimesResolved = resolveMaxTimes || 1;
    var timesResolved = 0;
    var next = nextProm || [];

    var getValue = function(){
        return promiseValue;
    }

    var getReason = function(){
        return promiseReason;
    }
    this.isPending = function(){
        return promiseStatusIndex === 0;
    }
    this.isFulfilled = function(){
        return promiseStatusIndex === 1;
    }
    this.isRejected = function(){
        return promiseStatusIndex === 2;
    }
    this.isSettled = function(){
        return (promiseStatusIndex === 1) || (promiseStatusIndex === 2);
    }
    this.getStatus = function(){
        return PROMISE_STATUS[promiseStatusIndex];
    }

    var immediatelyFulfill = function(success, error){        
        var deferred = next.slice(1, next.length);

        if (error == undefined){
            error = PASS;
        }

        return new PrivatePromise(function(res, rej){
            try {
                res(success(getValue()));
            } catch (err){
                // if we're trying to pass the error to the next node of the chain
                // but the next node of the chain is undefined
                // throw error, otherwise pass it forward through the chain
                if (error == PASS && deferred.length == 0){
                    throw err;
                } else {
                    rej(error(err));   
                }
            }
        }, deferred);

    }

    var immediatelyReject = function(error){
        if (error == undefined){
            error = PASS;
        }
        
        var deferred = next.slice(1, next.length);

        return new PrivatePromise(function(res, rej){
            try {
                rej(error(getReason()));
            } catch (err){
                if (deferred.length == 0){
                    throw err;
                } else {
                    rej(PASS(err));   
                }
            }
        }, deferred);
        
    }
    this.resolve = function(value){
        if (promiseStatusIndex === 2){
            return promiseInstance;
        }

        var maxTimesResolvedReached = !!maxTimesResolved && (timesResolved >= maxTimesResolved);
        if (promiseStatusIndex === 1 && maxTimesResolvedReached){
            return promiseInstance;
        }

        timesResolved += 1;
        promiseStatusIndex = 1;
        promiseValue = value;

        if (next.length > 0){
            var toDo = next[0];
            if (toDo.onSuccess === toDo.onError){
                toDo.onError = PASS;
            }
            return immediatelyFulfill(toDo.onSuccess, toDo.onError);   
        }
    }
    this.reject = function(reason){
        if (promiseStatusIndex === 2){
            return promiseInstance;
        }
        promiseStatusIndex = 2;
        promiseReason = reason;

        if (next.length > 0){
            var toDo = next[0];
            return immediatelyReject(toDo.onError);
        }
    }

    var addNext = function(onSuccess, onError){

        if (typeof onError === 'undefined'){
            onError = PASS;
        }

        if (typeof onSuccess === 'undefined'){
            onSuccess = PASS;
        }

        next.push({
            onSuccess: onSuccess,
            onError: onError
        });
    }
    this.then = function(onSuccess, onError){
        if (promiseInstance.isPending()){
            addNext(onSuccess, onError);
            return promiseInstance;
        }

        if (promiseInstance.isFulfilled()){
            return immediatelyFulfill(onSuccess, onError);
        }

        if (promiseInstance.isRejected()){
            return immediatelyReject(onError);
        }
    }
    this.fail = function(onError){
        return promiseInstance.then(undefined, onError);
    }
    this.force = function(callback){
        return promiseInstance.then(callback, callback);
    }

    if (typeof executor === 'function'){
        executor(promiseInstance.resolve, promiseInstance.reject);
    }

}
var PublicPromise = function(executor, resolveMaxTimes){
    return new PrivatePromise(executor, undefined, resolveMaxTimes);
}
PublicPromise.all = function(promiseList){
    var promiseAll = new PublicPromise();
    var promiseCount = promiseList.length;

    var results = new Array(promiseCount);
    var reasons = new Array(promiseCount);
    var fulfilled = new Array(promiseCount);

    var checkAllFulfilled = function(){
        var counted = 0;
        for (var key in fulfilled){
            counted++;
            if (!fulfilled[key]){
                promiseAll.reject(reasons);
                return;
            }
        }

        if (counted == promiseCount){
            promiseAll.resolve(results);
        }
    }
    
    var promise;
    
    for (var i=0; i<promiseList.length; i++){
        promise = promiseList[i];
        
        (function(num, prom){
            prom.then(function(value){
                fulfilled[num] = true;
                results[num] = value;
                checkAllFulfilled();
            }).fail(function(reason){
                fulfilled[num] = false;
                reasons[num] = reason;
                checkAllFulfilled();
            });
        })(i, promise);
    }

    return promiseAll;
}
PublicPromise.race = function(promiseList){
    var promiseRace = new PublicPromise();
    var promiseCount = promiseList.length;
    var results = new Array(promiseCount);
    var reasons = new Array(promiseCount);
    
    var promise;
    for (var i=0; i<promiseList.length; i++){
        promise = promiseList[i];
        
        (function(num, prom){
            prom.then(function(value){
                results[num] = value;
                promiseRace.resolve(results);
            }).fail(function(reason){
                reasons[num] = reason;
                promiseRace.reject(reasons);
            });
        })(i, promise);
    }

    return promiseRace;
}
PublicPromise.any = function(promiseList){
    var promiseAny = new PublicPromise();
    var promiseCount = promiseList.length;

    var rejected = new Array(promiseCount);
    var reasons = new Array(promiseCount);
    var values = new Array(promiseCount);

    var allRejected = function(){
        for (var j=0; j<promiseCount; j++){
            if (!rejected[j]){
                return false;
            }
        }
        return true;
    }

    var promise;
    for (var i=0; i<promiseList.length; i++){
        promise = promiseList[i];
        
        (function(num, prom){
            prom.then(function(value){
                values[num] = value;
                promiseAny.resolve(values);
            }).fail(function(reason){
                rejected[num] = true;
                reasons[num] = reason;

                if (allRejected()){
                    promiseAny.reject(reasons);
                }
            });
        })(i, promise);
    }

    return promiseAny;
}

module.exports = PublicPromise;


},{}],2:[function(require,module,exports){
var PromiseLite = require('../bower_components/promiselite/src/promiselite.js');
var NewtonAdapter = new function(){

    var newtonInstance, logger;
    var enablePromise = new PromiseLite(); 
    var loginPromise = new PromiseLite(); 

    var createSimpleObject = function(object){
        object = object || {};
        return Newton.SimpleObject.fromJSONObject(object);
    };
    this.init = function(options){
        // get logger
        if (options.logger){
            logger = options.logger;
        } else {
            logger = { 
                debug: function(){},
                log: function(){},
                info: function(){},
                warn: function(){},
                error: function(){}
            };
        }

        // init enablePromise and init Newton
        enablePromise = new PromiseLite(); 
        enablePromise.then(function(){
            newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId, createSimpleObject(options.properties));
            logger.log('NewtonAdapter', 'Init', options);
        });
        enablePromise.fail(function(){
            logger.warn('Newton not enabled');
        });

        // check if enabled
        if (options.enable){
            enablePromise.resolve();
        } else {
            enablePromise.reject();
        }

        // init loginPromise
        loginPromise = new PromiseLite(); 
        loginPromise.fail(function(){
            logger.warn('Newton login not called');
        });

        // resolve loginPromise if not waitLogin and enable
        if(!options.waitLogin && options.enable){
            loginPromise.resolve();
        }
    };
    this.login = function(options){
        var loginCallback = function(){
            try {
                if(options.callback){ options.callback.call(); }
                logger.log('NewtonAdapter', 'Login', options);
                loginPromise.resolve();
            } catch(err) {
                logger.error('NewtonAdapter', 'Login', err);
                loginPromise.reject();
            }
        };

        enablePromise.then(function(){
            if(options.logged && !newtonInstance.isUserLogged()){
                if(options.type === 'external'){
                    newtonInstance.getLoginBuilder()
                    .setCustomData( createSimpleObject(options.userProperties) )
                    .setOnFlowCompleteCallback(loginCallback)
                    .setExternalID(options.userId)
                    .getExternalLoginFlow()
                    .startLoginFlow();
                } else {
                    newtonInstance.getLoginBuilder()
                    .setCustomData( createSimpleObject(options.userProperties) )
                    .setOnFlowCompleteCallback(loginCallback)
                    .setCustomID(options.userId)
                    .getCustomLoginFlow()
                    .startLoginFlow();
                }
            } else {
                loginCallback();
            }
        });

        return loginPromise;
    };
    this.rankContent = function(options){
        loginPromise.then(function(){
            if(!options.score) { options.score = 1; }
            newtonInstance.rankContent(options.contentId, options.scope, options.score);
            logger.log('NewtonAdapter', 'rankContent', options);
        });
    };
    this.trackEvent = function(options){
        loginPromise.then(function(){
            newtonInstance.sendEvent(options.name, createSimpleObject(options.properties));
            logger.log('NewtonAdapter', 'trackEvent', options.name, options.properties);
            if(options.rank){
                if(!options.score) { options.score = 1; }
                newtonInstance.rankContent(options.rank.contentId, options.rank.scope, options.rank.score);
                logger.log('NewtonAdapter', 'rankContent', options.rank);
            }
        });
    };
    this.trackPageview = function(options){
        if(!options){
            options = {};
        }
        if(!options.properties){
            options.properties = {};
        }
        if(!options.properties.url){
            options.properties.url = window.location.href;
        }
        options.name = 'pageview';
        NewtonAdapter.trackEvent(options);
    };
    this.startHeartbeat = function(options){
        loginPromise.then(function(){
            logger.log('NewtonAdapter', 'startHeartbeat', options);
            newtonInstance.timedEventStart(options.name, createSimpleObject(options.properties));
        });
    };
    this.stopHeartbeat = function(options){
        loginPromise.then(function(){
            newtonInstance.timedEventStop(options.name, createSimpleObject(options.properties));
            logger.log('NewtonAdapter', 'stopHeartbeat', options);
        });
    };
    this.isUserLogged = function(){
        return Newton.getSharedInstance().isUserLogged();
    };
};

module.exports = NewtonAdapter;
},{"../bower_components/promiselite/src/promiselite.js":1}]},{},[2])(2)
});