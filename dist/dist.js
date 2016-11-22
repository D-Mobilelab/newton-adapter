(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NewtonAdapter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

},{}],2:[function(require,module,exports){
var Promise = require('promise-polyfill');
var NewtonAdapter = new function(){

    var newtonInstance, logger, newtonversion;
    var enablePromiseResolve, enablePromiseReject, loginPromiseResolve, loginPromiseReject;
    var enablePromise = new Promise(function(resolve, reject){
        enablePromiseResolve = function(data){
            resolve(data);
        };
        enablePromiseReject = function(data){
            reject(data);
        };
    }); 
    var loginPromise = new Promise(function(resolve, reject){
        loginPromiseResolve = function(data){
            resolve(data);
        };
        loginPromiseReject = function(data){
            reject(data);
        };
    }); 

    var createSimpleObject = function(object){
        object = object || {};
        return Newton.SimpleObject.fromJSONObject(object);
    };

    // USE ONLY FOR TEST!
    this.resetForTest = function(){
        // TODO: check this for test
        enablePromise = new Promise(function(resolve, reject){
            enablePromiseResolve = function(data){
                resolve(data);
            };
            enablePromiseReject = function(data){
                reject(data);
            };
        }); 
        loginPromise = new Promise(function(resolve, reject){
            loginPromiseResolve = function(data){
                resolve(data);
            };
            loginPromiseReject = function(data){
                reject(data);
            };
        }); 
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

        // get Newton version
        if (options.newtonversion){
            newtonversion = options.newtonversion;
        } else {
            newtonversion = 2;
        }

        // init enablePromise and init Newton
        enablePromise.then(function(){
            if(newtonversion === 1){
                newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId);
                if(!!options.properties){
                    logger.warn('NewtonAdapter', 'Newton v.1 not support properties on init method');
                }
            } else {
                newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId, createSimpleObject(options.properties));
            }
            logger.log('NewtonAdapter', 'Init', options);
        });
        enablePromise.catch(function(){});

        // check if enabled
        var isNewtonExist = !!window.Newton;
        if(!isNewtonExist){
            logger.error('NewtonAdapter', 'Newton not exist');
            enablePromiseReject(new Error('Newton not exist'));
            loginPromiseReject(new Error('Newton not exist'));
        } else if(options.enable){           
            enablePromiseResolve();
        } else {
            logger.warn('NewtonAdapter', 'Newton not enabled');
            enablePromiseReject(new Error('Newton not enabled'));
            loginPromiseReject(new Error('Newton not enabled'));
        }

        // init loginPromise
        loginPromise.catch(function(error){
            logger.warn('NewtonAdapter', 'Newton login failed', error);
        });

        // resolve loginPromise if not waitLogin and enable
        if(!options.waitLogin && options.enable){
            loginPromiseResolve();
        }

        return enablePromise;
    };
    this.login = function(options){
        var loginCallback = function(){
            try {
                if(options.callback){ options.callback.call(); }
                logger.log('NewtonAdapter', 'Login', options);
                loginPromiseResolve();
            } catch(err) {
                logger.error('NewtonAdapter', 'Login', err);
                loginPromiseReject(err);
            }
        };

        enablePromise.then(function(){
            if(options.logged && !newtonInstance.isUserLogged()){
                if(options.type === 'external'){
                    if(newtonversion === 1){
                        logger.error('NewtonAdapter', 'Login', 'Newton v.1 not support external login');
                    } else {
                        newtonInstance.getLoginBuilder()
                        .setCustomData( createSimpleObject(options.userProperties) )
                        .setOnFlowCompleteCallback(loginCallback)
                        .setExternalID(options.userId)
                        .getExternalLoginFlow()
                        .startLoginFlow();
                    }
                } else {
                    if(newtonversion === 1){
                        newtonInstance.getLoginBuilder()
                        .setLoginData( createSimpleObject(options.userProperties) )
                        .setCallback(loginCallback)
                        .setCustomID(options.userId)
                        .getCustomFlow()
                        .startLoginFlow();
                    } else {
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
    this.rankContent = function(options){
        loginPromise.then(function(){
            if(!options.score) { options.score = 1; }
            if(newtonversion === 1){
                logger.error('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
            } else {
                newtonInstance.rankContent(options.contentId, options.scope, options.score);
            }
            logger.log('NewtonAdapter', 'rankContent', options);
        });
        return loginPromise;
    };
    this.trackEvent = function(options){
        loginPromise.then(function(){
            newtonInstance.sendEvent(options.name, createSimpleObject(options.properties));
            logger.log('NewtonAdapter', 'trackEvent', options.name, options.properties);
            if(options.rank){
                if(!options.rank.score) { options.rank.score = 1; }
                if(newtonversion === 1){
                    logger.error('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
                } else {
                    newtonInstance.rankContent(options.rank.contentId, options.rank.scope, options.rank.score);
                    logger.log('NewtonAdapter', 'rankContent', options.rank);
                }
            }
        });
        return loginPromise;
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
        return loginPromise;
    };
    this.stopHeartbeat = function(options){
        loginPromise.then(function(){
            newtonInstance.timedEventStop(options.name, createSimpleObject(options.properties));
            logger.log('NewtonAdapter', 'stopHeartbeat', options);
        });
        return loginPromise;
    };
    this.isUserLogged = function(){
        try {
            return Newton.getSharedInstance().isUserLogged();
        } catch(e) {
            enablePromise.then(function(){
                logger.error('NewtonAdapter', 'isUserLogged', e);
            });
            return false;
        }
    };
    this.isInitialized = function(){
        // TODO: check this
        // return enablePromise.isSettled();
    };
};

module.exports = NewtonAdapter;
},{"promise-polyfill":1}]},{},[2])(2)
});