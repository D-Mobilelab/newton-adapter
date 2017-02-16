var Promise = require('promise-polyfill');
var Bluebus = require('./bluebus');

/**
* @ngdoc object
* @name NewtonAdapter
*
* @description
* Adapter for Newton sdk to be used in B! web applications
*/
var NewtonAdapter = new function(){

    var newtonversion, newtonInstance, logger, beforeInit;

    (beforeInit = function(){
        newtonversion = 2;
        newtonInstance = false;
        logger = { 
            debug: function(){},
            log: function(){},
            info: function(){},
            warn: function(){},
            error: function(){}
        }; 
        Bluebus.cleanAll();
    })();
    
    var createSimpleObject = function(object){
        var newObject = object || {};
        return Newton.SimpleObject.fromJSONObject(newObject);
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
        return new Promise(function(resolve, reject){  
            // get logger
            if(options.logger){
                logger = options.logger;
            }

            // get newtonversion
            if(options.newtonversion){
                newtonversion = options.newtonversion;
            }

            // check if Newton exists
            if(!Newton){
                reject();
                logger.error('NewtonAdapter', 'Newton not exist');
            } else {

                // init Newton and trigger init
                var initNewton = function(){
                    if(newtonversion === 1){
                        newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId);
                        if(options.properties){
                            logger.warn('NewtonAdapter', 'Newton v.1 not support properties on init method');
                        }
                    } else {
                        newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId, createSimpleObject(options.properties));
                    }

                    // resolve, trigger and log
                    resolve(true);
                    logger.log('NewtonAdapter', 'Init', options);
                    Bluebus.trigger('init');

                    // trigger login if waitLogin is false
                    if(!options.waitLogin){
                        Bluebus.trigger('login');
                    }
                };

                // call initNewton if enabled
                if(!options.enable){
                    resolve(false);
                    logger.warn('NewtonAdapter', 'Newton not enabled');
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
        return new Promise(function(resolve, reject){
            Bluebus.bind('init', function(){

                // login Newton and trigger login
                var loginNewton = function(){
                    try {
                        // callback, resolve, trigger and log
                        if(options.callback){ options.callback.call(); }
                        resolve();
                        logger.log('NewtonAdapter', 'Login', options);
                        Bluebus.trigger('login');
                    } catch(err) {
                        // reject and log
                        reject();
                        logger.error('NewtonAdapter', 'Login', err);
                    }
                };

                if(!options.logged || newtonInstance.isUserLogged()){                    
                    loginNewton();
                } else {                    
                    var loginType = options.type ? options.type : 'custom';

                    // newton version 1
                    if(newtonversion === 1){
                        if(loginType === 'custom'){
                            if(options.userId){
                                newtonInstance.getLoginBuilder()
                                .setLoginData(createSimpleObject(options.userProperties))
                                .setCallback(loginNewton)
                                .setCustomID(options.userId)
                                .getCustomFlow()
                                .startLoginFlow();  
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'Custom login requires userId');
                            }
                        } else {
                            reject();                            
                            logger.error('NewtonAdapter', 'Login', 'Newton v.1 not support this type of login');
                        }

                    // newton version 2
                    } else {
                        if(loginType === 'custom'){
                            if(options.userId){
                                newtonInstance.getLoginBuilder()
                                .setCustomData(createSimpleObject(options.userProperties))
                                .setOnFlowCompleteCallback(loginNewton)
                                .setCustomID(options.userId)
                                .getCustomLoginFlow()
                                .startLoginFlow();  
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'Custom login requires userId');
                            }
                        } else if(loginType === 'external'){
                            if(options.userId && options.userProperties){
                                newtonInstance.getLoginBuilder()
                                .setCustomData(createSimpleObject(options.userProperties))
                                .setOnFlowCompleteCallback(loginNewton)
                                .setExternalID(options.userId)
                                .getExternalLoginFlow()
                                .startLoginFlow();
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'External login requires userId and properties');
                            }
                        } else if(loginType === 'msisdn'){
                            if(options.msisdn && options.pin){
                                newtonInstance.getLoginBuilder()
                                .setOnFlowCompleteCallback(loginNewton)
                                .setMSISDN(options.msisdn)
                                .setPIN(options.pin)
                                .getMSISDNPINLoginFlow()
                                .startLoginFlow();
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'MSISDN login requires msisdn and pin');
                            }
                        } else if(loginType === 'autologin'){
                            if(options.domain){
                                newtonInstance.getLoginBuilder()
                                .setOnFlowCompleteCallback(loginNewton)
                                .__setDomain(options.domain)
                                .getMSISDNURLoginFlow()
                                .startLoginFlow();
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'Autologin requires domain');
                            }
                        } else if(loginType === 'oauth'){
                            if(options.provider && options.access_token){
                                newtonInstance.getLoginBuilder()
                                .setOAuthProvider(options.provider)
                                .setAccessToken(options.access_token)
                                .setOnFlowCompleteCallback(loginNewton)
                                .getOAuthLoginFlow()
                                .startLoginFlow();
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'OAuth requires provider and access_token');
                            }
                        } else {
                            reject();
                            logger.error('NewtonAdapter', 'Login', 'This type of logis is not supported');
                        }
                    }
                }
            });
        });
    };


    /**
    * @ngdoc function
    * @name logout
    * @methodOf NewtonAdapter
    *
    * @description Performs logout from Newton if user is logged
    *
    * @return {Promise} promise that will be resolved when the logout has been completed
    *
    * @example
    * <pre>
    * NewtonAdapter.logout();
    * </pre>
    */
    this.logout = function(){
        return new Promise(function(resolve, reject){
            Bluebus.bind('init', function(){
                try {
                    if(newtonInstance.isUserLogged()){                    
                        newtonInstance.userLogout();
                        resolve();
                    } else {                    
                        logger.warn('NewtonAdapter', 'User is already unlogged');
                        resolve();
                    }
                } catch(err) {
                    logger.error('NewtonAdapter', 'Logout', err);
                    reject();
                }
            });
        });
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
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                var score = options.score ? options.score : 1;
                if(newtonversion === 1){
                    reject();
                    logger.error('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
                } else {
                    newtonInstance.rankContent(options.contentId, options.scope, score);
                    resolve();
                    logger.log('NewtonAdapter', 'rankContent', options);
                }
            });
        });
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
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                newtonInstance.sendEvent(options.name, createSimpleObject(options.properties));
                resolve();
                logger.log('NewtonAdapter', 'trackEvent', options.name, options.properties);
                if(options.rank){
                    var score = options.rank.score ? options.rank.score : 1;
                    if(newtonversion === 1){
                        logger.error('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
                    } else {
                        newtonInstance.rankContent(options.rank.contentId, options.rank.scope, score);
                        logger.log('NewtonAdapter', 'rankContent', options.rank);
                    }
                }
            });
        });
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
        var eventParams = options || {};
        eventParams.name = 'pageview';
        if(!eventParams.properties){
            eventParams.properties = {};
        }
        if(!eventParams.properties.url){
            eventParams.properties.url = window.location.href;
        }
        return NewtonAdapter.trackEvent(eventParams);
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
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                newtonInstance.timedEventStart(options.name, createSimpleObject(options.properties));
                resolve();
                logger.log('NewtonAdapter', 'startHeartbeat', options);                
            });
        });
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
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                newtonInstance.timedEventStop(options.name, createSimpleObject(options.properties));
                resolve();
                logger.log('NewtonAdapter', 'startHeartbeat', options);                
            });
        });
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
        return Bluebus.isTriggered('init');
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

    this.addIdentity = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){

                // identiry Newton and resolve
                var identityNewton = function(){
                    try {
                        // callback, resolve, trigger and log
                        if(options.callback){ options.callback.call(); }
                        resolve();
                        logger.log('NewtonAdapter', 'addIdentity', options);
                    } catch(err) {
                        // reject and log
                        reject();
                        logger.error('NewtonAdapter', 'addIdentity', err);
                    }
                };

                var identityType = options.type ? options.type : 'oauth';
                if(identityType === 'oauth'){
                    if(options.provider && options.access_token){
                        newtonInstance.getIdentityManager()
                        .getIdentityBuilder()
                        .setOAuthProvider(options.provider)
                        .setAccessToken(options.access_token)
                        .setOnFlowCompleteCallback(identityNewton)
                        .getAddOAuthIdentityFlow()
                        .startAddIdentityFlow(); 
                    } else {
                        reject();
                        logger.error('NewtonAdapter', 'addIdentity', 'addIdentity requires provider and access_token');
                    }
                } else {
                    reject();
                    logger.error('NewtonAdapter', 'addIdentity', 'This type of add identity is not supported');
                }
            });
        });
    };

    this.removeIdentity = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){

                if(newtonInstance.isUserLogged()){                    
                    newtonInstance.getIdentityManager().getIdentities(function(err, identities){
                        try {
                            if(err){ 
                                logger.error('NewtonAdapter', 'removeIdentity', err);
                                reject();
                            }
                            logger.log('NewtonAdapter', 'removeIdentity', options, identities);
                            for (var i = 0; i < identities.length; i++) {
                                if (options.type == identities[i].getType()){
                                    identities[i].delete(options.callback);
                                }
                            }
                            resolve();
                        } catch(error) {
                            logger.error('NewtonAdapter', 'removeIdentity', err);
                            reject();
                        }
                    });
                } else {                    
                    logger.warn('NewtonAdapter', 'User is unlogged, you can\'t remove identity');
                    reject();
                }
            });
        });
    };
};

module.exports = NewtonAdapter;