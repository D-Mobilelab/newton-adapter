(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["NewtonAdapter"] = factory();
	else
		root["NewtonAdapter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Promise = __webpack_require__(1);

	/**
	* @ngdoc object
	* @name NewtonAdapter
	*
	* @description
	* Adapter for Newton sdk to be used in B! web applications
	*/
	var NewtonAdapter = new function(){

	    var newtonInstance, logger, newtonversion, beforeInit;
	    var enablePromise, enablePromiseResolve, enablePromiseReject, enablePromiseFullfilled;
	    var loginPromise, loginPromiseResolve, loginPromiseReject, loginPromiseFullfilled;

	    (beforeInit = function(){
	        newtonInstance = false;
	        enablePromiseFullfilled = false;
	        loginPromiseFullfilled = false;
	        enablePromise = new Promise(function(resolve, reject){
	            enablePromiseResolve = function(data){
	                enablePromiseFullfilled = true;
	                resolve(data);
	            };
	            enablePromiseReject = function(data){
	                enablePromiseFullfilled = true;
	                reject(data);
	            };
	        }); 
	        loginPromise = new Promise(function(resolve, reject){
	            loginPromiseResolve = function(data){
	                loginPromiseFullfilled = true;
	                resolve(data);
	            };
	            loginPromiseReject = function(data){
	                loginPromiseFullfilled = true;
	                reject(data);
	            };
	        }); 
	    })();

	    var createSimpleObject = function(object){
	        object = object || {};
	        return Newton.SimpleObject.fromJSONObject(object);
	    };

	    // USE ONLY FOR TEST!
	    this.resetForTest = function(){
	        beforeInit();
	    };

	    /**
	    * @ngdoc function
	    * @name init
	    * @methodOf NewtonAdapter
	    *
	    * @description Initializes Newton sdk and sets up internal configuration.
	    *
	    * @param {Object} options configuration object
	    * @param {string} options.secretId secret id of the application
	    * @param {boolean} [options.enable=false] enable or disable calls to Newton library
	    * @param {boolean} [options.waitLogin=false] track events, heartbeats and rankings only after login<br/><i>If true, you have to call login() in all cases, both for logged and unlogged users.
	    * @param {boolean} [options.waitDeviceReady=false] wait deviceReady event to initialize Newton library. It's useful for hybrid environment
	    * @param {integer} [options.newtonversion=2] version of Newton, it can be 1 or 2.
	    * @param {Object} [options.logger=disabled logger] logger object containing the methods: debug, log, info, warn, error
	    * @param {Object} [options.properties={}] custom data for Newton session<br/><i>Newton version 1: this property is not supported</i>
	    *
	    * @return {Promise} promise that will be resolved when the init has been completed
	    * 
	    * @example
	    * <pre>
	    *   NewtonAdapter.init({
	    *       secretId: '123456789',
	    *       enable: true,
	    *       waitLogin: true,
	    *       waitDeviceReady: false,
	    *       version: 2,
	    *       logger: console,
	    *       properties: {
	    *           hello: 'World'
	    *       }
	    *   });
	    * </pre>
	    */
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
	            if(options.waitDeviceReady){
	                document.addEventListener('deviceready', enablePromiseResolve, false);
	            } else {
	                enablePromiseResolve();
	            }        
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


	    /**
	    * @ngdoc function
	    * @name login
	    * @methodOf NewtonAdapter
	    *
	    * @description Performs custom or external login via Newton sdk. <br/>
	    * <i>If you set waitLogin=true on init method, you have to call this method in all cases, for logged and unlogged users.</i>
	    *
	    * @param {Object} options configuration object
	    * @param {string} [options.type="custom"] type of Newton login used, it can be 'custom' or 'external'<br><i>Newton version 1: external login not supported</i>
	    * @param {boolean} [options.logged=false] true if user is logged, false if user is unlogged
	    * @param {Object} [options.userProperties={}] custom user properties
	    *
	    * @return {Promise} promise that will be resolved when the login has been completed
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.login({
	    *       logged: true,
	    *       type: 'external',
	    *       userId: '123456789',
	    *       userProperties: {
	    *           msisdn: '+39123456789',
	    *           type: 'freemium'
	    *       }
	    * });
	    * </pre>
	    */
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
	                        .setCustomData(createSimpleObject(options.userProperties))
	                        .setOnFlowCompleteCallback(loginCallback)
	                        .setExternalID(options.userId)
	                        .getExternalLoginFlow()
	                        .startLoginFlow();
	                    }
	                } else {
	                    if(newtonversion === 1){
	                        newtonInstance.getLoginBuilder()
	                        .setLoginData(createSimpleObject(options.userProperties))
	                        .setCallback(loginCallback)
	                        .setCustomID(options.userId)
	                        .getCustomFlow()
	                        .startLoginFlow();
	                    } else {
	                        newtonInstance.getLoginBuilder()
	                        .setCustomData(createSimpleObject(options.userProperties))
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


	    /**
	    * @ngdoc function
	    * @name rankContent
	    * @methodOf NewtonAdapter
	    *
	    * @description Performs content ranking via Newton sdk<br><i>Newton version 1: feature not supported</i>
	    *
	    * @param {Object} options configuration object
	    * @param {string} contentId unique identifier of the content
	    * @param {string} scope type of action performed on the content
	    * @param {number} score the score associated to the content
	    *
	    * @return {Promise} promise that will be resolved when the login has been completed
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.rankContent({
	    *       contentId: '123456777',
	    *       scope: 'social',
	    *       score: 4
	    * });
	    * </pre>
	    */
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

	    /**
	    * @ngdoc function
	    * @name trackEvent
	    * @methodOf NewtonAdapter
	    *
	    * @description Performs event tracking via Newton sdk.
	    *
	    * @param {Object} options configuration object
	    * @param {string} options.name name of the event to track
	    * @param {object} [options.properties={}] custom datas of the event
	    * @param {object} [options.rank={}] rank event datas. Newton version 1: feature not supported
	    *
	    * @return {Promise} promise that will be resolved when the login has been completed
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.trackEvent({
	    *       name: 'Play',
	    *       properties: {
	    *           category: 'Game',
	    *           content: 'Fruit Slicer'
	    *       },
	    *       rank: {
	    *           contentId: '123456777',
	    *           scope: 'social',
	    *           score: 4
	    *       }
	    * });
	    * </pre>
	    */
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

	    /**
	    * @ngdoc function
	    * @name trackPageview
	    * @methodOf NewtonAdapter
	    *
	    * @description Performs pageview tracking via Newton sdk.
	    *
	    * @param {Object} options configuration object
	    * @param {Object} options.properties Properties of the pageview
	    * @param {string} [options.properties.url=window.location.href] url of pageview
	    *
	    * @return {Promise} promise that will be resolved when the login has been completed
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.trackPageview({
	    *       properties: {
	    *           url: 'http://www.google.it',
	    *           title: 'Game',
	    *           hello: 'World'
	    *       }
	    * });
	    * </pre>
	    */
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
	        return NewtonAdapter.trackEvent(options);
	    };

	    /**
	    * @ngdoc function
	    * @name startHeartbeat
	    * @methodOf NewtonAdapter
	    *
	    * @description Performs timed events via Newton sdk.
	    *
	    * @param {Object} options configuration object
	    * @param {string} options.name name of the timed event
	    * @param {Object} [options.properties={}] details of the timed event
	    *
	    * @return {Promise} promise that will be resolved when the login has been completed
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.startHeartbeat({
	    *       name: 'Playing',
	    *       properties: {
	    *           category: 'Game',
	    *           content: 'Fruit Slicer'
	    *       }
	    *   });
	    * </pre>
	    */
	    this.startHeartbeat = function(options){
	        loginPromise.then(function(){
	            logger.log('NewtonAdapter', 'startHeartbeat', options);
	            newtonInstance.timedEventStart(options.name, createSimpleObject(options.properties));
	        });
	        return loginPromise;
	    };

	    /**
	    * @ngdoc function
	    * @name stopHeartbeat
	    * @methodOf NewtonAdapter
	    *
	    * @description Stops timed events via Newton sdk.
	    *
	    * @param {Object} options configuration object
	    * @param {string} options.name name of the timed event
	    * @param {Object} [options.properties={}] details of the timed event
	    *
	    * @return {Promise} promise that will be resolved when the login has been completed
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.stopHeartbeat({
	    *       name: 'Playing',
	    *       properties: {
	    *           category: 'Game',
	    *           content: 'Fruit Slicer'
	    *       }
	    *   });
	    * </pre>
	    */
	    this.stopHeartbeat = function(options){
	        loginPromise.then(function(){
	            newtonInstance.timedEventStop(options.name, createSimpleObject(options.properties));
	            logger.log('NewtonAdapter', 'stopHeartbeat', options);
	        });
	        return loginPromise;
	    };

	    /**
	    * @ngdoc function
	    * @name isUserLogged
	    * @methodOf NewtonAdapter
	    *
	    * @description Check if the user is already logged on Newton.<br><i>If called before init, this method returns false.</i>
	    *
	    * @return {boolean} true if the user is already logged on Newton, else false
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.isUserLogged();
	    * </pre>
	    */
	    this.isUserLogged = function(){
	        if(newtonInstance){
	            return newtonInstance.isUserLogged();
	        } else {
	            return false;
	        }
	    };

	    /**
	    * @ngdoc function
	    * @name isInitialized
	    * @methodOf NewtonAdapter
	    *
	    * @description Check if NewtonAdapter is initialized.
	    *
	    * @return {boolean} true if NewtonAdapter is already initialized (you have called init method)
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.isInitialized();
	    * </pre>
	    */
	    this.isInitialized = function(){
	        return !!enablePromiseFullfilled;
	    };

	    /**
	    * @ngdoc function
	    * @name getUserToken
	    * @methodOf NewtonAdapter
	    *
	    * @description Get Newton user token
	    *
	    * @return {string} Newton user token
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.getUserToken();
	    * </pre>
	    */
	    this.getUserToken = function(){
	        if(newtonInstance){
	            return newtonInstance.getUserToken();
	        } else {
	            return false;
	        }
	    };

	    /**
	    * @ngdoc function
	    * @name setUserStateChangeListener
	    * @methodOf NewtonAdapter
	    *
	    * @description Listen user state change
	    *
	    * @param {function} callback method called when user changes state
	    *
	    * @return {boolean} return true if Newton is already initialized, else false. If not inizialized, the callback doesn't listen user state change
	    *
	    * @example
	    * <pre>
	    * NewtonAdapter.setUserStateChangeListener(function(state){ console.log(state); });
	    * </pre>
	    */
	    this.setUserStateChangeListener = function(callback){
	        if(newtonInstance){
	            newtonInstance.setUserStateChangeListener(callback);
	            return true;
	        } else {
	            return false;
	        }
	    };
	};

	module.exports = NewtonAdapter;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {

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

	  /**
	   * Take a potentially misbehaving resolver function and make sure
	   * onFulfilled and onRejected are only called once.
	   *
	   * Makes no guarantees about asynchrony.
	   */
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

	  /**
	   * Set the immediate function to execute callbacks
	   * @param fn {function} Function to execute
	   * @deprecated
	   */
	  Promise._setImmediateFn = function _setImmediateFn(fn) {
	    Promise._immediateFn = fn;
	  };

	  /**
	   * Change the function to execute on unhandled rejection
	   * @param {function} fn Function to execute on unhandled rejection
	   * @deprecated
	   */
	  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
	    Promise._unhandledRejectionFn = fn;
	  };
	  
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = Promise;
	  } else if (!root.Promise) {
	    root.Promise = Promise;
	  }

	})(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(3);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ])
});
;