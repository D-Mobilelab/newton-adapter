/* Version: 1.4.2 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NewtonAdapter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var PROMISE_STATUS = {
    0: 'pending',
    1: 'fulfilled',
    2: 'rejected'
};

var pass = function(arg){
    return arg;
};

var PrivatePromise = function(executor, nextProm){

    // executor called at the end of the definition of Promise
    if (typeof executor !== 'undefined' && typeof executor !== 'function'){
        throw new Error('PromiseLite :: executor must be a function, got ' + typeof executor);
    }

    var promiseInstance = this;
    var promiseStatusIndex = 0;
    var promiseValue;
    var promiseReason;
    var next = nextProm || [];

    var getValue = function(){
        return promiseValue;
    };

    var getReason = function(){
        return promiseReason;
    };
    this.isPending = function(){
        return promiseStatusIndex === 0;
    };
    this.isFulfilled = function(){
        return promiseStatusIndex === 1;
    };
    this.isRejected = function(){
        return promiseStatusIndex === 2;
    };
    this.isSettled = function(){
        return (promiseStatusIndex === 1) || (promiseStatusIndex === 2);
    };
    this.getStatus = function(){
        return PROMISE_STATUS[promiseStatusIndex];
    };

    var getDeferredPromises = function(){
        var toReturn = next.slice(1, next.length);
        next = [];
        return toReturn;
    };

    var immediatelyFulfill = function(success, error){

        if (typeof success === 'undefined'){
            success = pass;
        }

        if (typeof error === 'undefined'){
            error = pass;
        }

        var deferred = getDeferredPromises();

        return new PrivatePromise(function(res, rej){
            try {
                res(success(getValue()));
            } catch (err){
                // if we're trying to pass the error to the next node of the chain
                // but the next node of the chain is undefined
                // throw error, otherwise pass it forward through the chain
                if (error === pass && deferred.length === 0){
                    throw err;
                } else {
                    rej(error(err));
                }
            }
        }, deferred);

    };

    var immediatelyReject = function(error){
        if (typeof error === 'undefined'){
            error = pass;
        }

        var deferred = getDeferredPromises();

        return new PrivatePromise(function(res, rej){
            try {
                if (error === pass && deferred.length === 0){
                    throw getReason();
                } else {
                    rej(error(getReason()));
                }
            } catch (err){

                if (deferred.length === 0){
                    throw err;
                } else {
                    rej(pass(err));
                }
            }
        }, deferred);

    };
    this.resolve = function(value){
        if (promiseInstance.isSettled()){
            return promiseInstance;
        }

        promiseStatusIndex = 1;
        promiseValue = value;

        if (next.length > 0){
            var toDo = next[0];
            if (toDo.onSuccess === toDo.onError){
                toDo.onError = pass;
            }
            return immediatelyFulfill(toDo.onSuccess, toDo.onError);
        }
    };
    this.reject = function(reason){
        if (promiseInstance.isRejected()){
            return promiseInstance;
        }

        promiseStatusIndex = 2;
        promiseReason = reason;

        if (next.length > 0){
            var toDo = next[0];
            return immediatelyReject(toDo.onError);
        }
    };

    var addNext = function(onSuccess, onError){

        next.push({
            onSuccess: onSuccess,
            onError: onError
        });
    };
    this.then = function(onSuccess, onError){

        if (promiseInstance.isPending()){
            addNext(onSuccess, onError);
            return promiseInstance;
        }

        if (promiseInstance.isFulfilled() && !!onSuccess){
            return immediatelyFulfill(onSuccess, onError);
        }

        if (promiseInstance.isRejected() && !!onError){
            return immediatelyReject(onError);
        }
    };
    this.fail = function(onError){
        return promiseInstance.then(undefined, onError);
    };
    this.force = function(callback){
        return promiseInstance.then(callback, callback);
    };

    if (typeof executor === 'function'){
        executor(promiseInstance.resolve, promiseInstance.reject);
    }

};
var PublicPromise = function(executor){
    return new PrivatePromise(executor, undefined);
};
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

        if (counted === promiseCount){
            promiseAll.resolve(results);
        }
    };

    var promise;

    var innerFunction = function(num, prom){
        prom.then(function(value){
            fulfilled[num] = true;
            results[num] = value;
            checkAllFulfilled();
        }).fail(function(reason){
            fulfilled[num] = false;
            reasons[num] = reason;
            checkAllFulfilled();
        });
    };

    for (var i = 0; i < promiseList.length; i++){
        promise = promiseList[i];
        innerFunction(i, promise);
    }

    return promiseAll;
};
PublicPromise.race = function(promiseList){
    var promiseRace = new PublicPromise();
    var promiseCount = promiseList.length;
    var results = new Array(promiseCount);
    var reasons = new Array(promiseCount);

    var promise;
    var innerFunction = function(num, prom){
        prom.then(function(value){
            results[num] = value;
            promiseRace.resolve(results);
        }).fail(function(reason){
            reasons[num] = reason;
            promiseRace.reject(reasons);
        });
    };

    for (var i = 0; i < promiseList.length; i++){
        promise = promiseList[i];
        innerFunction(i, promise);
    }

    return promiseRace;
};
PublicPromise.any = function(promiseList){
    var promiseAny = new PublicPromise();
    var promiseCount = promiseList.length;

    var rejected = new Array(promiseCount);
    var reasons = new Array(promiseCount);
    var values = new Array(promiseCount);

    var allRejected = function(){
        for (var j = 0; j < promiseCount; j++){
            if (!rejected[j]){
                return false;
            }
        }
        return true;
    };

    var promise;
    var innerFunction = function(num, prom){
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
    };

    for (var i = 0; i < promiseList.length; i++){
        promise = promiseList[i];
        innerFunction(i, promise);
    }

    return promiseAny;
};

module.exports = PublicPromise;
},{}],2:[function(require,module,exports){
var PromiseLite = require('promiselite');
var NewtonAdapter = new function(){

    var newtonInstance, logger;
    var enablePromise = new PromiseLite();
    var loginPromise = new PromiseLite();

    var createSimpleObject = function(object){
        object = object || {};
        return Newton.SimpleObject.fromJSONObject(object);
    };

    // USE ONLY FOR TEST!
    this.resetForTest = function(){
        enablePromise = new PromiseLite();
        loginPromise = new PromiseLite();
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
        enablePromise.then(function(){
            newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId, createSimpleObject(options.properties));
            logger.log('NewtonAdapter', 'Init', options);

            newtonInstance.setUserStateChangeListener({
                onLoginStateChange: function(err) {
                    if (err) {
                        logger.log('Error: ' + err.message);
                    }
                    if (!newtonInstance.isUserLogged()) {
                        logger.log('User is unlogged');
                        NewtonAdapter.logout();
                    }
                    if(options.onchangeuserstate){ options.onchangeuserstate.call(err); }
                    return;
                }
            });
        });
        enablePromise.fail(function(){});

        // check if enabled
        var isNewtonExist = !!window.Newton;
        if(!isNewtonExist){
            logger.error('Newton not exist');
            enablePromise.reject();
        } else if(options.enable){
            enablePromise.resolve();
        } else {
            logger.warn('Newton not enabled');
            enablePromise.reject();
        }

        // init loginPromise
        loginPromise.fail(function(error){
            logger.warn('Newton login failed', error);
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
            if(!newtonInstance.isUserLogged()){
                switch(options.type){
                    case 'msisdn':
                        if(options.msisdn && options.pin){
			                // msisdn + pin login
                            newtonInstance.getLoginBuilder()
                            .setOnFlowCompleteCallback(loginCallback)
                            .setMSISDN(options.msisdn)
                            .setPIN(options.pin)
                            .getMSISDNPINLoginFlow()
                            .startLoginFlow();
                        } else {
			                // autorecognize login flow
                            newtonInstance.getLoginBuilder()
                            .setOnFlowCompleteCallback(loginCallback)
                            .__setDomain(options.domain)
                            .getMSISDNURLoginFlow()
                            .startLoginFlow();
                        }
                        break;
                    case 'oauth':
                        if(options.access_token){
                            // OAuth Direct Flow
                            newtonInstance.getLoginBuilder()
                            .setOAuthProvider(options.provider)
                            .setAccessToken(options.access_token)
                            .setOnFlowCompleteCallback(loginCallback)
                            .getOAuthLoginFlow()
                            .startLoginFlow();
                        }
                        break;
                    case 'external':
                        if (options.logged) {
                            newtonInstance.getLoginBuilder()
                            .setCustomData( createSimpleObject(options.userProperties) )
                            .setOnFlowCompleteCallback(loginCallback)
                            .setExternalID(options.userId)
                            .getExternalLoginFlow()
                            .startLoginFlow();
                        }
                        break;
                    default:
                        if (options.logged) {
                            newtonInstance.getLoginBuilder()
                            .setCustomData( createSimpleObject(options.userProperties) )
                            .setOnFlowCompleteCallback(loginCallback)
                            .setCustomID(options.userId)
                            .getCustomLoginFlow()
                            .startLoginFlow();
                        }
                }
            } else {
                loginCallback();
            }
        });

        return loginPromise;
    };
    this.logout = function(){
        if(this.isUserLogged()){
            newtonInstance.userLogout();
        }
        if (typeof(FB) !== 'undefined' && FB.getAccessToken()){
            logger.log('FB Logout');
            FB.logout();
        }
    };
    this.addIdentity = function(options){
        var identityCallback = function(err){
            logger.log('NewtonAdapter', 'AddIdentity', options);
            if(options.callback){ options.callback(err); }
        };

        if(newtonInstance.isUserLogged()){
            switch(options.type){
                case 'msisdn':
                    break;
                case 'oauth':
                    if(options.access_token){
                        // OAuth Direct Flow
                        newtonInstance.getIdentityManager()
                        .getIdentityBuilder()
                        .setOAuthProvider(options.provider)
                        .setAccessToken(options.access_token)
                        .setOnFlowCompleteCallback(identityCallback)
                        .getAddOAuthIdentityFlow()
                        .startAddIdentityFlow();
                    }
                    break;
            }
        }
    };
    this.removeIdentity = function(options){
        var identitiesCallback = function(err, identities){
            try {
                if(err){ return; }
                logger.log('NewtonAdapter', 'removeIdentity', options);
                logger.log('NewtonAdapter', 'identities', JSON.stringify(identities));
                for (var i = 0, len = identities.length; i < len; i++) {
                    if (options.type == identities[i].getType()){
                         identities[i].delete(options.callback);
                    }
                }
            } catch(err) {
                logger.error('NewtonAdapter', 'removeIdentity', err);
            }
        };
        if(newtonInstance.isUserLogged()){
            newtonInstance.getIdentityManager()
            .getIdentities(identitiesCallback);
        }
    };
    this.recoverPassword = function(options){
        var forgotCallback = function(err){
            logger.log('NewtonAdapter', 'recoverPassword', options);
            if(options.callback){ options.callback(err); }
        };
        if (options.msisdn){
            newtonInstance
            .getLoginBuilder()
            .setOnForgotFlowCallback(forgotCallback)
            .setMSISDN(options.msisdn)
            .getMSISDNPINForgotFlow()
            .startForgotFlow();
        } else {
            logger.log('No valid credentials provided')
        }
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
                if(!options.rank.score) { options.rank.score = 1; }
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
        return newtonInstance.isUserLogged();
    };
    this.getUserToken = function(){
        return newtonInstance.getUserToken();
    };
    this.finalizeLoginFlow = function(callback){
        newtonInstance.finalizeLoginFlow(callback);
    };
    this.setUserStateChangeListener = function(callback){
        newtonInstance.setUserStateChangeListener(callback);
    };
    this.userDelete = function(options){
        var identitiesCallback = function(err, identities){
            try {
                if(err){ return; }
                logger.log('NewtonAdapter', 'userDelete', options);
                logger.log('NewtonAdapter', 'identities', JSON.stringify(identities));

                for (var i = 0, len = identities.length; i < len; i++) {
                    if (identities[i].getType() == 'msisdn'){
                        logger.error('NewtonAdapter', 'Error on userDelete: please use unsubscribe instead');
                        return;
                    }
                }

                newtonInstance.getIdentityManager().userDelete(options.callback);
                NewtonAdapter.logout();

            } catch(err) {
                logger.error('NewtonAdapter', 'userDelete', err);
            }
        };
        if(newtonInstance.isUserLogged()){
            newtonInstance.getIdentityManager()
            .getIdentities(identitiesCallback);
        }
    }
};

module.exports = NewtonAdapter;
},{"promiselite":1}]},{},[2])(2)
});