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
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	/* global Newton */
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc object
	* @name NewtonAdapter
	*
	* @description
	* Adapter for Newton sdk to be used in B! web applications
	*/
	module.exports = new function(){

	    // USE ONLY FOR TEST!
	    /**
	     * TODO: if(process.env.NODE_ENV === 'test') {
	     *  
	     * }
	     */
	    this.resetForTest = function(){
	        Global.cleanAll();
	        Bluebus.cleanAll();
	    };

	    this.startHeartbeat = __webpack_require__(3);
	    this.stopHeartbeat = __webpack_require__(9);

	    this.getIdentities = __webpack_require__(10);   
	    this.getIdentity = __webpack_require__(11);   
	    this.addIdentity = __webpack_require__(12);   
	    this.removeIdentity = __webpack_require__(13)({ Bluebus: Bluebus, Global: Global });

	    this.init = __webpack_require__(14);
	    this.isInitialized = __webpack_require__(15);

	    this.autoLogin = __webpack_require__(16);
	    this.finalizeLoginFlow = __webpack_require__(17);
	    this.isUserLogged = __webpack_require__(18);
	    this.login = __webpack_require__(19);
	    this.logout = __webpack_require__(20);
	    this.setUserStateChangeListener = __webpack_require__(21);

	    this.rankContent = __webpack_require__(22);
	    this.trackEvent = __webpack_require__(23);
	    this.trackPageview = __webpack_require__(24);
	    this.setLogView = __webpack_require__(25);

	    this.confirmEmail = __webpack_require__(26);
	    this.confirmEmailAndLogin = __webpack_require__(27);
	    this.getUserToken = __webpack_require__(28);
	    this.recoverPassword = __webpack_require__(29);
	    this.resetPassword = __webpack_require__(30);
	    this.userDelete = __webpack_require__(31);    
	};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["Bluebus"] = factory();
		else
			root["Bluebus"] = factory();
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
	/***/ (function(module, exports) {

		module.exports = {

		    /*
		    events: {
		        eventName: {
		            triggered: true/false,
		            parameters: lastTriggeredParameters,
		            stack: [
		                bindedFunction1, bindedFunction2 ...
		            ]
		        }
		    }
		    */

		    events: {},

		    bind: function(key, callback){
		        var event = this.events[key];
		        if(event){
		            if(event.triggered){
		                callback.call(this, event.parameters);
		            } else {
		                event.stack.push(callback);
		            }
		        } else {
		            this.events[key] = {
		                triggered: false,
		                parameters: undefined,
		                stack: [callback]
		            };
		        }
		    },

		    trigger: function(key, parameters, leaveStack){
		        var event = this.events[key];
		        if(event){
		            // call binding methods
		            if(event.stack.length > 0){
		                for(var i = 0; i < event.stack.length; i++){
		                    event.stack[i].call(this, parameters);
		                }
		            }

		            // change event properties
		            this.events[key] = {
		                triggered: true,
		                parameters: parameters,
		                stack: leaveStack ? this.events[key].stack : []
		            };
		        } else {
		            // change event properties
		            this.events[key] = {
		                triggered: true,
		                parameters: parameters,
		                stack: []
		            };
		        }
		    },

		    isTriggered: function(key){
		        var event = this.events[key];
		        if(event){
		            return event.triggered;
		        } else {
		            return false;
		        }
		    },

		    clean: function(key){
		        this.events[key] = {
		            triggered: false,
		            parameters: undefined,
		            stack: []
		        };
		    },

		    cleanAll: function(){
		        this.events = {};
		    }

		};


	/***/ })
	/******/ ])
	});
	;

	/* Bluebus 1.3.1 */

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	var Global = {
	    newtonversion: 2,
	    newtonInstance: false,
	    logger: {
	        debug: function(){},
	        log: function(){},
	        info: function(){},
	        warn: function(){},
	        error: function(){}
	    },

	    cleanAll: function(){
	        this.newtonversion = 2;
	        this.newtonInstance = false;
	        this.logger = {
	            debug: function(){},
	            log: function(){},
	            info: function(){},
	            warn: function(){},
	            error: function(){}
	        };
	    }
	};

	module.exports = Global;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);
	var Utility = __webpack_require__(8);

	/**
	* @ngdoc function
	* @name startHeartbeat
	* @methodOf NewtonAdapter
	*
	* @description Performs Newton start timed event<br>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	*
	* @param {Object} options configuration object
	* @param {string} options.name name of the timed event
	* @param {Object} [options.properties={}] properties of the timed event
	*
	* @return {Promise} promise will be resolved when start is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.startHeartbeat({
	*       name: 'Playing',
	*       properties: {
	*           category: 'Game',
	*           content: 'Fruit Slicer'
	*       }
	*   }).then(function(){
	*       console.log('startHeartbeat success');
	*   }).catch(function(err){
	*       console.log('startHeartbeat failed', err);
	*   });
	* </pre>
	*/

	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('login', function(){
	            if(options && options.name){
	                Global.newtonInstance.timedEventStart(options.name, Utility.createSimpleObject(options.properties));
	                resolve();
	                Global.logger.log('NewtonAdapter', 'startHeartbeat', options);
	            } else {
	                reject('startHeartbeat requires name');
	                Global.logger.error('NewtonAdapter', 'startHeartbeat', 'startHeartbeat requires name');
	            }
	        });
	    });
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).setImmediate))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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
	__webpack_require__(6);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(7)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

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
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	var Utility = {
	    createSimpleObject: function(object){
	        try {
	            var newObject = object || {};
	            return Newton.SimpleObject.fromJSONObject(newObject);
	        } catch(err){
	            Global.logger.warn('NewtonAdapter', 'Newton.SimpleObject.fromJSONObject is failed', err);
	            return Newton.SimpleObject.fromJSONObject({});
	        }
	    }
	};

	module.exports = Utility;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);
	var Utility = __webpack_require__(8);

	/**
	* @ngdoc function
	* @name stopHeartbeat
	* @methodOf NewtonAdapter
	*
	* @description Performs Newton stop timed event<br>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	*
	* @param {Object} options configuration object
	* @param {string} options.name name of the timed event
	* @param {Object} [options.properties={}] properties of the timed event
	*
	* @return {Promise} promise will be resolved when stop is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.stopHeartbeat({
	*       name: 'Playing',
	*       properties: {
	*           category: 'Game',
	*           content: 'Fruit Slicer'
	*       }
	*   }).then(function(){
	*       console.log('stopHeartbeat success');
	*   }).catch(function(err){
	*       console.log('stopHeartbeat failed', err);
	*   });
	* </pre>
	*/
	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('login', function(){
	            if(options && options.name){
	                Global.newtonInstance.timedEventStop(options.name, Utility.createSimpleObject(options.properties));
	                resolve();
	                Global.logger.log('NewtonAdapter', 'startHeartbeat', options);
	            } else {
	                reject('startHeartbeat requires name');
	                Global.logger.error('NewtonAdapter', 'startHeartbeat', 'startHeartbeat requires name');
	            }
	        });
	    });
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name getIdentities
	* @methodOf NewtonAdapter
	*
	* @description Get identities from current user<br/>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	*
	* @return {string} promise that will be resolved when the identities has been retrieved for the current user, rejected if failed
	*
	* @example
	* <pre>
	* NewtonAdapter.getIdentities();
	* </pre>
	*/

	module.exports = function(){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('login', function(){
	            Global.newtonInstance.getIdentityManager().getIdentities(function(err, identities){
	                if(err){
	                    reject(err);
	                    Global.logger.error('NewtonAdapter', 'getIdentities', err);
	                } else {
	                    resolve(identities);
	                    Global.logger.log('NewtonAdapter', 'getIdentities', identities);
	                }
	            });
	        });
	    });
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name getIdentities
	* @methodOf NewtonAdapter
	*
	* @description Get identities from current user<br/>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	*
	* @return {string} promise that will be resolved when the identities has been retrieved for the current user, rejected if failed
	*
	* @example
	* <pre>
	* NewtonAdapter.getIdentities();
	* </pre>
	*/

	module.exports = function(identityType){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('login', function(){
	            Global.newtonInstance.getIdentityManager().getIdentities(function(err, identities){
	                if(err){
	                    reject(err);
	                    Global.logger.error('NewtonAdapter', 'getIdentities', err);
	                } else {
	                    var singleIdentity = false;

	                    for(var index in identities){ //eslint-disable-line
	                        if(identities[index] && identities[index].getType() === identityType){
	                            singleIdentity = identities[index];
	                        }
	                    }
	                    
	                    resolve(singleIdentity);
	                    Global.logger.log('NewtonAdapter', 'getIdentities', identities);
	                }
	            });
	        });
	    });
	};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);
	var Utility = __webpack_require__(8);

	/**
	* @ngdoc function
	* @name addIdentity
	* @methodOf NewtonAdapter
	*
	* @description Add identity to an user<br>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	*
	* @param {Object} options configuration object
	* @param {string} [options.type='oauth'] type of identity to add (oauth, email, generic)
	* @param {string} options.provider provider of identity to add (oauth)
	* @param {string} options.access_token access token of identity to add (oauth)
	* @param {string} options.email email of identity to add (email)
	* @param {string} options.password password of identity to add (email)
	* @param {Object} [options.params={}] params of identity to add (email)
	* @param {string} options.smsTemplate SMS template of identity to add (generic)
	*
	* @return {Promise} ppromise will be resolved when adding is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.addIdentity({
	*       type: 'oauth',
	*       provider: 'Facebook',
	*       access_token: '1234567890'
	*   }).then(function(){
	*       console.log('addIdentity success');
	*   }).catch(function(err){
	*       console.log('addIdentity failed', err);
	*   });
	* </pre>
	*/

	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('login', function(){
	            var identityType = options.type ? options.type : 'oauth';

	            var callback = function(errLocal, identityTypeLocal, optionsLocal){
	                if(errLocal){
	                    reject(errLocal);
	                    Global.logger.error('NewtonAdapter', 'addIdentity', identityTypeLocal, errLocal);
	                } else {
	                    resolve();
	                    Global.logger.log('NewtonAdapter', 'addIdentity', identityTypeLocal, optionsLocal);
	                }
	            };

	            if(identityType === 'oauth'){
	                if(options.provider && options.access_token){
	                    Global.newtonInstance.getIdentityManager()
	                    .getIdentityBuilder()
	                    .setOAuthProvider(options.provider)
	                    .setAccessToken(options.access_token)
	                    .setOnFlowCompleteCallback(function(err){ callback(err, identityType, options); })
	                    .getAddOAuthIdentityFlow()
	                    .startAddIdentityFlow();
	                } else {
	                    reject('addIdentity outh requires provider and access_token');
	                    Global.logger.error('NewtonAdapter', 'addIdentity', 'Oauth', 'addIdentity oauth requires provider and access_token');
	                }
	            } else if(identityType === 'email'){
	                if(options.email && options.password){
	                    if(options.smsTemplate){
	                        Global.newtonInstance.getIdentityManager()
	                        .getIdentityBuilder()
	                        .setEmail(options.email)
	                        .setPassword(options.password)
	                        .setProductEmailParams(Utility.createSimpleObject(options.params))
	                        .setOnFlowCompleteCallback(function(err){ callback(err, identityType, options); })
	                        .setSMSTemplate(options.smsTemplate)
	                        .getAddEmailIdentityFlow()
	                        .startAddIdentityFlow();
	                    } else {
	                        Global.newtonInstance.getIdentityManager()
	                        .getIdentityBuilder()
	                        .setEmail(options.email)
	                        .setPassword(options.password)
	                        .setProductEmailParams(Utility.createSimpleObject(options.params))
	                        .setOnFlowCompleteCallback(function(err){ callback(err, identityType, options); })
	                        .getAddEmailIdentityFlow()
	                        .startAddIdentityFlow();
	                    }
	                } else {
	                    reject('addIdentity email, requires email and password');
	                    Global.logger.error('NewtonAdapter', 'addIdentity', 'Email', 'addIdentity email requires email and password');
	                }
	            } else if(identityType === 'generic'){
	                if(options.smsTemplate){
	                    Global.newtonInstance.getIdentityManager()
	                    .getIdentityBuilder()
	                    .setOnFlowCompleteCallback(function(err){ callback(err, identityType, options); })
	                    .setSMSTemplate(options.smsTemplate)
	                    .getAddGenericIdentityFlow()
	                    .startAddIdentityFlow();
	                } else {
	                    reject('addIdentity generic, requires smsTemplate');
	                    Global.logger.error('NewtonAdapter', 'addIdentity', 'Generic', 'addIdentity generic requires smsTemplate');
	                }
	            } else {
	                reject('This type of add identity is not supported');
	                Global.logger.error('NewtonAdapter', 'addIdentity', 'This type of add identity is not supported');
	            }
	        });
	    });
	};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	/* global Newton */
	var Promise = __webpack_require__(4);
	/**
	* @ngdoc function
	* @name removeIdentity
	* @methodOf NewtonAdapter
	*
	* @description Remove identity from an user<br>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	*
	* @param {Object} options configuration object
	* @param {string} options.type type of identity to remove
	* @param {string} options.identity identity instance to remove
	*
	* @return {Promise} promise will be resolved when removing is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.removeIdentity({
	*       type: 'oauth'
	*   }).then(function(){
	*       console.log('removeIdentity success');
	*   }).catch(function(err){
	*       console.log('removeIdentity failed', err);
	*   });
	* </pre>
	*/
	module.exports = function(deps){
	    return function(options){
	        return new Promise(function(resolve, reject){
	            deps.Bluebus.bind('login', function(){
	                if(options.type){
	                    deps.Global.newtonInstance.getIdentityManager().getIdentities(function(identError, identities){
	                        if(identError){
	                            reject(identError);
	                            deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'getIdentities failed', identError);
	                        } else {
	                            deps.Global.logger.log('NewtonAdapter', 'removeIdentity', 'getIdentities success', options, identities);
	                            if(identities.length < 2){
	                                reject('it\'s not possible remove unique identity');
	                                deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'it\'s not possible remove unique identity');
	                            } else {
	                                var found = false;
	                                for(var i = 0; i < identities.length; i++) {
	                                    if (options.type === identities[i].getType()){
	                                        found = true;
	                                        identities[i].delete(function(deleteError){
	                                            if(deleteError){
	                                                reject(deleteError);
	                                                deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'delete failed', deleteError);
	                                            } else {
	                                                resolve(true);
	                                                deps.Global.logger.log('NewtonAdapter', 'removeIdentity', 'delete success');
	                                            }
	                                        });
	                                        break;
	                                    }
	                                }
	                                
	                                if (!found) {
	                                    /** If we're here there was no match */
	                                    var err = new Error('no identities for ' + options.type);
	                                    err.code = 404;
	                                    err.name = 'NotFound';
	                                    reject(err);
	                                }                                
	                            }
	                        }
	                    });
	                } else if(options.identity) {
	                    options.identity.delete(function(deleteError){
	                        if(deleteError) {
	                            reject(deleteError);
	                            deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'delete failed', deleteError);
	                        } else {
	                            resolve(true);
	                            deps.Global.logger.log('NewtonAdapter', 'removeIdentity', 'delete success');
	                        }
	                    });
	                } else {
	                    reject('removeIdentity requires type or identity object');
	                    deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'removeIdentity requires type or identity object');
	                }
	            });
	        });
	    };
	};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);
	var Utility = __webpack_require__(8);

	/**
	* @ngdoc function
	* @name init
	* @methodOf NewtonAdapter
	*
	* @description Initializes Newton sdk and sets up internal configuration.
	*
	* @param {Object} options configuration object
	* @param {string} options.secretId secret id of the application
	* @param {boolean} [options.enable=false] enable calls to Newton library
	* @param {boolean} [options.waitLogin=false] all Newton calls wait login (logged and unlogged)
	* @param {boolean} [options.waitDeviceReady=false] wait deviceReady event to initialize Newton
	* @param {integer} [options.newtonversion=2] version of Newton (1 or 2)
	* @param {Object} [options.logger=disabled logger] object with debug, log, info, warn, error
	* @param {Object} [options.properties={}] custom data for Newton session (not supported for v1)
	* @param {Function} [options.pushCallback=null] a function that will be called in hybrid init(wait for device ready must be true)
	*
	* @return {Promise} promise will be resolved when init is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.init({
	*       secretId: '123456789',
	*       enable: true,
	*       waitLogin: true,
	*       waitDeviceReady: false,
	*       newtonversion: 2,
	*       logger: console,
	*       properties: {
	*           hello: 'World'
	*       },
	*       pushCallback:function(pushData){}
	*   }).then(function(enabled){
	*       console.log('init success', enabled);
	*   }).catch(function(err){
	*       console.log('init failed', err);
	*   });
	* </pre>
	*/

	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        // get logger and newtonversion
	        if(options.logger){
	            Global.logger = options.logger;
	        }
	        if(options.newtonversion){
	            Global.newtonversion = options.newtonversion;
	        }

	        // check if Newton exists
	        if(!Newton){
	            reject('Newton not exist');
	            Global.logger.error('NewtonAdapter', 'Init', 'Newton not exist');
	        } else {

	            var initNewton = function(){
	                // init Newton
	                if(Global.newtonversion === 1){
	                    Global.newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId);
	                    if(options.properties){
	                        Global.logger.warn('NewtonAdapter', 'Init', 'Newton v.1 not support properties on init method');
	                    }
	                } else {
	                    var args = [options.secretId, Utility.createSimpleObject(options.properties)];
	                    if (options.pushCallback) { args.push(options.pushCallback); }
	                    Global.newtonInstance = Newton.getSharedInstanceWithConfig.apply(null, args);
	                }

	                // trigger init
	                resolve(true);
	                Global.logger.log('NewtonAdapter', 'Init', options);
	                Bluebus.trigger('init');

	                // trigger login, if waitLogin is false
	                if(!options.waitLogin){
	                    Bluebus.trigger('login');
	                }
	            };

	            if(!options.enable){
	                resolve(false);
	                Global.logger.warn('NewtonAdapter', 'Init', 'Newton not enabled');
	            } else {
	                if(options.waitDeviceReady){
	                    document.addEventListener('deviceready', initNewton, false);
	                } else {
	                    initNewton();
	                }
	            }
	        }
	    });
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Bluebus = __webpack_require__(1);

	/**
	* @ngdoc function
	* @name isInitialized
	* @methodOf NewtonAdapter
	*
	* @description Check if NewtonAdapter is initialized.
	* <br><b>Synchronous call, don't wait init</b>
	*
	* @return {boolean} true if init has been called, else false
	*
	* @example
	* <pre>
	* NewtonAdapter.isInitialized();
	* </pre>
	*/

	module.exports = function(){
	    return Bluebus.isTriggered('init');
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	/* global Newton */
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name autoLogin
	* @methodOf NewtonAdapter
	*
	* @description start autoLogin flow
	*
	* @param {Object} options configuration object
	* @param {string} options.waitingUrl url for waiting page
	* @param {string} options.subscribeUrl url for account page (redirect here if user isn't subscribed)
	*
	* @example
	* <pre>
	*   NewtonAdapter.autoLogin({
	*     "waitingUrl":"http://www.domain.com/#!/waiting",
	        "subscribeUrl":"http://www.domain.com/#!/settings"
	*   });
	* </pre>
	*/
	module.exports = function(options){
	    var instance;
	    if(options.waitingUrl){
	        instance = Global.newtonInstance.getLoginBuilder();
	        if(options.subscribeUrl) {
	            instance.setSubscribeUrl(options.subscribeUrl);
	        }
	        instance.setWaitingUrl(options.waitingUrl)
	        .getMSISDNURLoginFlow()
	        .startLoginFlow();
	    } else {
	        Global.logger.error('NewtonAdapter', 'autoLogin', 'autoLogin requires waiting url');
	    }
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name finalizeLoginFlow
	* @methodOf NewtonAdapter
	*
	* @description Execute callback when finalize login flow
	* <br><b>Synchronous call, don't wait init</b>
	*
	* @param {function} callback method called when finalize login flow
	*
	* @return {boolean} return true if init has been called before, false if init has not been called before or callback is undefined
	*
	* @example
	* <pre>
	* NewtonAdapter.finalizeLoginFlow(function(){ console.log('ok'); });
	* </pre>
	*/

	module.exports = function(callback){
	    if(Global.newtonInstance && callback){
	        Global.newtonInstance.finalizeLoginFlow(callback);
	        return true;
	    } else {
	        return false;
	    }
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name isUserLogged
	* @methodOf NewtonAdapter
	*
	* @description Check if the user is already logged on Newton.
	* <br><b>Synchronous call, don't wait init</b>
	*
	* @return {boolean} true if the user is already logged, false if user is unlogged or init has not been called before
	*
	* @example
	* <pre>
	* NewtonAdapter.isUserLogged();
	* </pre>
	*/

	module.exports = function(){
	    if(Global.newtonInstance){
	        return Global.newtonInstance.isUserLogged();
	    } else {
	        return false;
	    }
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);
	var Utility = __webpack_require__(8);

	/**
	* @ngdoc function
	* @name login
	* @methodOf NewtonAdapter
	*
	* @description Performs Newton login
	*
	* @param {Object} options configuration object
	* @param {boolean} [options.logged=false] new state of the user
	* @param {string} [options.type="custom"] (custom, external, msisdn, autologin, generic or oauth)
	* @param {string} options.userId required for custom and external login
	* @param {Object} [options.userProperties={}] available only for custom and external login
	* @param {string} options.pin required for msisdn login
	* @param {string} options.msisdn required for msisdn login
	* @param {string} options.domain required for autologin login
	* @param {string} options.provider required for oauth login
	* @param {string} options.access_token required for oauth login
	* @param {string} options.username required for generic login
	* @param {string} options.email required for email login
	* @param {string} options.password required for generic and email login
	*
	* @return {Promise} promise will be resolved when login is completed, rejected if failed
	*
	* @example
	* <pre>
	* // for logged users
	*   NewtonAdapter.login({
	*       logged: true,
	*       type: 'external',
	*       userId: '123456789',
	*       userProperties: {
	*           msisdn: '+39123456789',
	*           type: 'freemium'
	*       }
	*   }).then(function(){
	*       console.log('login success');
	*   }).catch(function(err){
	*       console.log('login failed', err);
	*   });
	*
	* // for unlogged users
	* NewtonAdapter.login({
	*       logged: false
	* });
	* </pre>
	*/

	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('init', function(){

	            if(options.callback){
	                Global.logger.warn('NewtonAdapter', 'Login', 'Callback method for login is not supported, use promise-then');
	            }

	            var callCallback = function(err){
	                if(err){
	                    reject(err);
	                    Global.logger.error('NewtonAdapter', 'Login', err);
	                } else {
	                    resolve();
	                    Global.logger.log('NewtonAdapter', 'Login', options);
	                    Bluebus.trigger('login');
	                }
	            };

	            if(!options.logged || Global.newtonInstance.isUserLogged()){
	                callCallback();
	            } else {
	                var loginType = options.type ? options.type : 'custom';

	                // newton version 1
	                if(Global.newtonversion === 1){
	                    if(loginType === 'custom'){
	                        if(options.userId){
	                            Global.newtonInstance.getLoginBuilder()
	                            .setLoginData(Utility.createSimpleObject(options.userProperties))
	                            .setCallback(callCallback)
	                            .setCustomID(options.userId)
	                            .getCustomFlow()
	                            .startLoginFlow();
	                        } else {
	                            reject('Custom login requires userId');
	                            Global.logger.error('NewtonAdapter', 'Login', 'Custom login requires userId');
	                        }
	                    } else {
	                        reject('Newton v.1 not support this type of login');
	                        Global.logger.error('NewtonAdapter', 'Login', 'Newton v.1 not support this type of login');
	                    }

	                // newton version 2
	                } else {
	                    if(loginType === 'custom'){
	                        if(options.userId){
	                            Global.newtonInstance.getLoginBuilder()
	                            .setCustomData(Utility.createSimpleObject(options.userProperties))
	                            .setOnFlowCompleteCallback(callCallback)
	                            .setCustomID(options.userId)
	                            .getCustomLoginFlow()
	                            .startLoginFlow();
	                        } else {
	                            reject('Custom login requires userId');
	                            Global.logger.error('NewtonAdapter', 'Login', 'Custom login requires userId');
	                        }
	                    } else if(loginType === 'external'){
	                        if(options.userId){
	                            Global.newtonInstance.getLoginBuilder()
	                            .setCustomData(Utility.createSimpleObject(options.userProperties))
	                            .setOnFlowCompleteCallback(callCallback)
	                            .setExternalID(options.userId)
	                            .getExternalLoginFlow()
	                            .startLoginFlow();
	                        } else {
	                            reject('External login requires userId');
	                            Global.logger.error('NewtonAdapter', 'Login', 'External login requires userId');
	                        }
	                    } else if(loginType === 'msisdn'){
	                        if(options.msisdn){
	                            var msisdnChain = Global.newtonInstance.getLoginBuilder()
	                            .setOnFlowCompleteCallback(callCallback)
	                            .setMSISDN(options.msisdn);
	                            msisdnChain = options.pin ? msisdnChain.setPIN(options.pin) : msisdnChain.setNoPIN();
	                            if(options.operator){
	                                msisdnChain = msisdnChain.setOperator(options.operator);
	                            }
	                            msisdnChain.getMSISDNPINLoginFlow()
	                            .startLoginFlow();
	                        } else {
	                            reject('Msisdn login requires at least msisdn');
	                            Global.logger.error('NewtonAdapter', 'Login', 'Msisdn login requires at least msisdn');
	                        }
	                    } else if (loginType === 'alias') {
	                        if (options.alias) {
	                            var aliasChain = Global.newtonInstance.getLoginBuilder()
	                                .setOnFlowCompleteCallback(callCallback)
	                                .setAlias(options.alias);
	                            aliasChain = options.pin ? aliasChain.setPIN(options.pin) : aliasChain.setNoPIN();
	                            if (options.operator) {
	                                aliasChain = aliasChain.setOperator(options.operator);
	                            }
	                            aliasChain.getMSISDNPINLoginFlow()
	                                .startLoginFlow();
	                        } else {
	                            reject('Msisdn login requires at least msisdn');
	                            Global.logger.error('NewtonAdapter', 'Login', 'Msisdn login requires at least msisdn');
	                        }
	                    } else if(loginType === 'email'){
	                        if(options.email && options.password){
	                            Global.newtonInstance.getLoginBuilder()
	                            .setOnFlowCompleteCallback(callCallback)
	                            .setEmail(options.email)
	                            .setPassword(options.password)
	                            .getEmailLoginFlow()
	                            .startLoginFlow();
	                        } else {
	                            reject('Email login requires email and password');
	                            Global.logger.error('NewtonAdapter', 'Login', 'Email login requires email and password');
	                        }
	                    } else if(loginType === 'generic'){
	                        if(options.username && options.password){
	                            Global.newtonInstance.getLoginBuilder()
	                            .setOnFlowCompleteCallback(callCallback)
	                            .setUsername(options.username)
	                            .setPassword(options.password)
	                            .getGenericLoginFlow()
	                            .startLoginFlow();
	                        } else {
	                            reject('Generic login requires username and password');
	                            Global.logger.error('NewtonAdapter', 'Login', 'Generic login requires username and password');
	                        }
	                    } else if(loginType === 'autologin'){
	                        if(options.domain){
	                            Global.newtonInstance.getLoginBuilder()
	                            .setOnFlowCompleteCallback(callCallback)
	                            .__setDomain(options.domain)
	                            .getMSISDNURLoginFlow()
	                            .startLoginFlow();
	                        } else {
	                            reject('Autologin requires domain');
	                            Global.logger.error('NewtonAdapter', 'Login', 'Autologin requires domain');
	                        }
	                    } else if(loginType === 'oauth'){
	                        if(options.provider && options.access_token){
	                            Global.newtonInstance.getLoginBuilder()
	                            .setOAuthProvider(options.provider)
	                            .setAccessToken(options.access_token)
	                            .setOnFlowCompleteCallback(callCallback)
	                            .getOAuthLoginFlow()
	                            .startLoginFlow();
	                        } else {
	                            reject('OAuth login requires provider and access_token');
	                            Global.logger.error('NewtonAdapter', 'Login', 'OAuth login requires provider and access_token');
	                        }
	                    } else {
	                        reject('This type of login is unknown');
	                        Global.logger.error('NewtonAdapter', 'Login', 'This type of login is unknown');
	                    }
	                }
	            }
	        });
	    });
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name logout
	* @methodOf NewtonAdapter
	*
	* @description Performs logout from Newton
	* <br/><b>This method is executed after init</b>
	*
	* @return {Promise} promise will be resolved when logout is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.logout().then(function(wasLogged){
	*       console.log('logout success', wasLogged);
	*   })
	* </pre>
	*/

	module.exports = function(){
	    return new Promise(function(resolve){
	        Bluebus.bind('init', function(){
	            if(Global.newtonInstance.isUserLogged()){
	                Global.newtonInstance.userLogout();
	                resolve(true);
	                Global.logger.log('NewtonAdapter', 'Logout');
	            } else {
	                resolve(false);
	                Global.logger.warn('NewtonAdapter', 'Logout', 'User is already unlogged');
	            }
	        });
	    });
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name setUserStateChangeListener
	* @methodOf NewtonAdapter
	*
	* @description Execute callback when user state change
	* <br><b>Synchronous call, don't wait init</b>
	*
	* @param {function} callback method called when user state changes
	*
	* @return {boolean} return true if init has been called before, false if init has not been called before or callback is undefined
	*
	* @example
	* <pre>
	* NewtonAdapter.setUserStateChangeListener(function(state){ console.log(state); });
	* </pre>
	*/
	module.exports = function(callback){
	    if(Global.newtonInstance && callback){
	        Global.newtonInstance.setUserStateChangeListener(callback);
	        return true;
	    } else {
	        return false;
	    }
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name rankContent
	* @methodOf NewtonAdapter
	*
	* @description Performs Newton content ranking<br>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	* <br><b>Newton version 1 don't support this feature</b>
	*
	* @param {Object} options configuration object
	* @param {string} options.contentId unique identifier of the content
	* @param {string} options.scope type of action performed on the content
	* @param {number} [options.score=1] the score associated to the content
	*
	* @return {Promise} promise will be resolved when ranking is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.rankContent({
	*       contentId: '123456777',
	*       scope: 'social',
	*       score: 4
	*   }).then(function(){
	*       console.log('rankContent success');
	*   }).catch(function(err){
	*       console.log('rankContent failed', err);
	*   });
	* </pre>
	*/
	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('login', function(){
	            var score = options.score ? options.score : 1;
	            if(Global.newtonversion === 1){
	                reject('Newton v.1 not support rank content');
	                Global.logger.error('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
	            } else {
	                if(options.contentId && options.scope){
	                    Global.newtonInstance.rankContent(options.contentId, options.scope, score);
	                    resolve();
	                    Global.logger.log('NewtonAdapter', 'rankContent', options);
	                } else {
	                    reject('rankContent requires scope and contentId');
	                    Global.logger.error('NewtonAdapter', 'rankContent', 'rankContent requires scope and contentId');
	                }
	            }
	        });
	    });
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);
	var Utility = __webpack_require__(8);
	var rankContent = __webpack_require__(22);

	/**
	* @ngdoc function
	* @name trackEvent
	* @methodOf NewtonAdapter
	*
	* @description Performs Newton track event<br>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	*
	* @param {Object} options configuration object
	* @param {string} options.name name of the event to track
	* @param {object} [options.properties={}] custom data of the event
	* @param {object} [options.rank={}] rank content data
	*
	* @return {Promise} promise will be resolved when tracking is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.trackEvent({
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
	*   }).then(function(){
	*       console.log('trackEvent success');
	*   }).catch(function(err){
	*       console.log('trackEvent failed', err);
	*   });
	* </pre>
	*/
	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('login', function(){
	            if(options.name){
	                Global.newtonInstance.sendEvent(options.name, Utility.createSimpleObject(options.properties));
	                resolve();
	                Global.logger.log('NewtonAdapter', 'trackEvent', options);

	                if(options.rank){
	                    rankContent(options.rank);
	                }
	            } else {
	                reject('trackEvent requires name');
	                Global.logger.error('NewtonAdapter', 'trackEvent', 'trackEvent requires name');
	            }
	        });
	    });
	};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var trackEvent = __webpack_require__(23);

	/**
	* @ngdoc function
	* @name trackPageview
	* @methodOf NewtonAdapter
	*
	* @description Performs Newton pageview tracking<br>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	*
	* @param {Object} options configuration object
	* @param {Object} options.properties properties of the pageview
	* @param {string} [options.properties.url=window.location.href] url of pageview
	*
	* @return {Promise} promise will be resolved when tracking is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.trackPageview({
	*       properties: {
	*           url: 'http://www.google.it',
	*           title: 'Game',
	*           hello: 'World'
	*       }
	*   }).then(function(){
	*       console.log('trackPageview success');
	*   }).catch(function(err){
	*       console.log('trackPageview failed', err);
	*   });
	* </pre>
	*/
	module.exports = function(options){
	    var eventParams = options || {};
	    eventParams.name = 'pageview';
	    if(!eventParams.properties){
	        eventParams.properties = {};
	    }
	    if(!eventParams.properties.url){
	        eventParams.properties.url = window.location.href;
	    }
	    return trackEvent(eventParams);
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);
	var Utility = __webpack_require__(8);
	var rankContent = __webpack_require__(22);

	/**
	* @ngdoc function
	* @name setLogView
	* @methodOf NewtonAdapter
	*
	* @description Initialize LogView, passing paramenters<br>
	* <b>This method is executed after init</b>
	*
	* @param {Object} options logview configuration object
	*
	* @return {Promise} promise will be resolved when set is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.setLogView({
	*           endpoint: 'endpoint-xxx',
	*           uid: 'uid-xxx',
	*           label: 'label-xxx',
	*           pid: 'pid-xxx'
	*   }).then(function(){
	*       console.log('setLogView success');
	*   }).catch(function(err){
	*       console.log('setLogView failed', err);
	*   });
	* </pre>
	*/
	module.exports = function(properties){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('init', function(){
	            if(properties && Global.newtonInstance.setLogViewInfo){
	                Global.newtonInstance.setLogViewInfo(properties);
	                resolve();
	                Global.logger.log('NewtonAdapter', 'setLogView', properties);
	            } else if(!properties) {
	                reject('setLogView requires properties');
	                Global.logger.error('NewtonAdapter', 'setLogView', 'setLogView requires properties');
	            } else {
	                reject('setLogViewInfo method is not present on Newton SDK');
	                Global.logger.error('NewtonAdapter', 'setLogView', 'setLogViewInfo method is not present on Newton SDK');
	            }
	        });
	    });
	};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name confirmEmail
	* @methodOf NewtonAdapter
	*
	* @description Confirm email identity without logging user
	*
	* @param {Object} options configuration object
	* @param {string} [options.token] token to confirm email
	*
	* @return {Promise} promise that will be resolved when the confirmEmail has been completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.confirmEmail({
	*       token: 'nets:ff6ad467df62a58324b9:ifortune'
	*   }).then(function(){
	*       console.log('confirmEmail success');
	*   }).catch(function(err){
	*       console.log('confirmEmail failed', err);
	*   });
	* </pre>
	*/

	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('init', function(){
	            Global.newtonInstance.confirmEmail(options.token, function(err) {
	                if(err){
	                    reject(err);
	                    Global.logger.error('NewtonAdapter', 'confirmEmail', err);
	                } else {
	                    resolve();
	                    Global.logger.log('NewtonAdapter', 'confirmEmail', options);
	                }
	            });
	        });
	    });
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name confirmEmailAndLogin
	* @methodOf NewtonAdapter
	*
	* @description Confirm email flow and login to the service
	*
	* @param {Object} options configuration object
	* @param {string} options.token token to confirm email
	* @param {Object} [options.properties={}] properties of the timed event
	*
	* @return {Promise} promise will be resolved when stop is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.confirmEmailAndLogin({
	*       token: '123456'
	*   }).then(function(){
	*       console.log('confirmEmailAndLogin success');
	*   }).catch(function(err){
	*       console.log('confirmEmailAndLogin failed', err);
	*   });
	* </pre>
	*/

	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('init', function(){
	            Global.newtonInstance.getLoginBuilder().setOnFlowCompleteCallback(function(err) {
	                if(err){
	                    reject(err);
	                    Global.logger.error('NewtonAdapter', 'confirmEmailAndLogin', err);
	                } else {
	                    resolve();
	                    Global.logger.log('NewtonAdapter', 'confirmEmailAndLogin', options);
	                }
	            })
	            .setEmailToken(options.token)
	            .getEmailConfirmFlow()
	            .startLoginFlow();
	        });
	    });
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	/* global Newton */
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name getUserToken
	* @methodOf NewtonAdapter
	*
	* @description Get Newton user token
	* <br><b>Synchronous call, don't wait init</b>
	*
	* @return {string} Newton user token or false if init has not been called before
	*
	* @example
	* <pre>
	* NewtonAdapter.getUserToken();
	* </pre>
	*/

	module.exports = function(){
	    if(Global.newtonInstance){
	        return Global.newtonInstance.getUserToken();
	    } else {
	        return false;
	    }
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name recoverPassword
	* @methodOf NewtonAdapter
	*
	* @description Recover password of a user<br>
	*
	* @param {Object} options configuration object
	* @param {string} options.msisdn msisdn of the user
	* @param {string} options.email email of the user
	*
	* @return {Promise} promise will be resolved when recovering is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.recoverPassword({
	*       msidsn: '+391234567890'
	*   }).then(function(){
	*       console.log('recoverPassword success');
	*   }).catch(function(err){
	*       console.log('recoverPassword failed', err);
	*   });
	* </pre>
	*/

	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('init', function(){
	            if(options.msisdn){
	                if(options.smsTemplate){
	                    Global.newtonInstance.getLoginBuilder()
	                    .setOnForgotFlowCallback(function(err){
	                        if(err){
	                            reject(err);
	                            Global.logger.error('NewtonAdapter', 'recoverPassword', err);
	                        } else {
	                            resolve();
	                            Global.logger.log('NewtonAdapter', 'recoverPassword', options);
	                        }
	                    })
	                    .setMSISDN(options.msisdn)
	                    .setSMSTemplate(options.smsTemplate)
	                    .getMSISDNPINForgotFlow()
	                    .startForgotFlow();
	                } else {
	                    Global.newtonInstance.getLoginBuilder()
	                    .setOnForgotFlowCallback(function(err){
	                        if(err){
	                            reject(err);
	                            Global.logger.error('NewtonAdapter', 'recoverPassword', err);
	                        } else {
	                            resolve();
	                            Global.logger.log('NewtonAdapter', 'recoverPassword', options);
	                        }
	                    })
	                    .setMSISDN(options.msisdn)
	                    .getMSISDNPINForgotFlow()
	                    .startForgotFlow();
	                }
	            } else if(options.alias){
	                if(options.smsTemplate){
	                    Global.newtonInstance.getLoginBuilder()
	                    .setOnForgotFlowCallback(function (err) {
	                        if (err) {
	                            reject(err);
	                            Global.logger.error('NewtonAdapter', 'recoverPassword', err);
	                        } else {
	                            resolve();
	                            Global.logger.log('NewtonAdapter', 'recoverPassword', options);
	                        }
	                    })
	                    .setAlias(options.alias)
	                    .setSMSTemplate(options.smsTemplate)
	                    .getMSISDNPINForgotFlow()
	                    .startForgotFlow();
	                } else {
	                    Global.newtonInstance.getLoginBuilder()
	                    .setOnForgotFlowCallback(function (err) {
	                        if (err) {
	                            reject(err);
	                            Global.logger.error('NewtonAdapter', 'recoverPassword', err);
	                        } else {
	                            resolve();
	                            Global.logger.log('NewtonAdapter', 'recoverPassword', options);
	                        }
	                    })
	                    .setAlias(options.alias)
	                    .getMSISDNPINForgotFlow()
	                    .startForgotFlow();
	                }
	            } else if(options.email){
	                Global.newtonInstance.getLoginBuilder()
	                .setOnForgotFlowCallback(function(err){
	                    if(err){
	                        reject(err);
	                        Global.logger.error('NewtonAdapter', 'emailRecoverPassword', err);
	                    } else {
	                        resolve();
	                        Global.logger.log('NewtonAdapter', 'emailRecoverPassword', options);
	                    }
	                })
	                .setEmail(options.email)
	                .getEmailForgotFlow()
	                .startForgotFlow();
	            } else {
	                reject('recoverPassword requires msisdn or email');
	                Global.logger.error('NewtonAdapter', 'recoverPassword', 'recoverPassword requires msisdn or email');
	            }
	        });
	    });
	};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name resetPassword
	* @methodOf NewtonAdapter
	*
	* @description Reset password
	*
	* @param {Object} options configuration object
	* @param {string} options.password new password
	* @param {string} options.token access token
	*
	* @return {Promise} promise will be resolved when password is updated, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.resetPassword({
	*       password: 'NEWPASSWORD',
	*       token: '1234567890'
	*   }).then(function(){
	*       console.log('resetPassword success');
	*   }).catch(function(err){
	*       console.log('resetPassword failed', err);
	*   });
	* </pre>
	*/

	module.exports = function(options){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('init', function(){
	            if(options.token && !!options.password){
	                Global.newtonInstance.resetPassword(options.token, options.password, function(err){
	                    if(err){
	                        reject(err);
	                        Global.logger.error('NewtonAdapter', 'resetPassword', err);
	                    } else {
	                        resolve();
	                        Global.logger.log('NewtonAdapter', 'resetPassword', options);
	                    }
	                });
	            } else {
	                Global.logger.error('NewtonAdapter', 'resetPassword', 'resetPassword requires password and token');
	                reject('resetPassword requires password and token');
	            }
	        });
	    });
	};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-env browser */
	/* global Newton */
	var Promise = __webpack_require__(4);
	var Bluebus = __webpack_require__(1);
	var Global = __webpack_require__(2);

	/**
	* @ngdoc function
	* @name userDelete
	* @methodOf NewtonAdapter
	*
	* @description Delete an user<br>
	* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
	*
	* @return {Promise} ppromise will be resolved when deleting is completed, rejected if failed
	*
	* @example
	* <pre>
	*   NewtonAdapter.userDelete().then(function(){
	*       console.log('userDelete success');
	*   }).catch(function(err){
	*       console.log('userDelete failed', err);
	*   });
	* </pre>
	*/

	module.exports = function(){
	    return new Promise(function(resolve, reject){
	        Bluebus.bind('login', function(){
	            Global.newtonInstance.getIdentityManager().getIdentities(function(identError, identities){
	                if(identError){
	                    reject(identError);
	                    Global.logger.error('NewtonAdapter', 'userDelete', 'getIdentities failed', identError);
	                } else {
	                    Global.logger.log('NewtonAdapter', 'userDelete', 'getIdentities success', identities);
	                    for(var i = 0, goFoward = true; i < identities.length && goFoward; i++){
	                        if (identities[i].getType() === 'msisdn'){
	                            goFoward = false;
	                            reject('Error on userDelete: please use unsubscribe instead');
	                            Global.logger.error('NewtonAdapter', 'userDelete', 'Error on userDelete: please use unsubscribe instead');
	                        }
	                    }
	                    Global.newtonInstance.getIdentityManager().userDelete(function(deleteError){
	                        if(deleteError){
	                            reject(deleteError);
	                            Global.logger.error('NewtonAdapter', 'userDelete', 'delete', deleteError);
	                        } else {
	                            resolve();
	                            Global.logger.log('NewtonAdapter', 'userDelete', identities);
	                        }
	                    });
	                }
	            });
	        });
	    });
	};

/***/ })
/******/ ])
});
;

/* Newton Adapter 2.11.0 */