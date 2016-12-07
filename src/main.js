var Promise = require('promise-polyfill');

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
};

module.exports = NewtonAdapter;