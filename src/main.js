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
        try {
            var newObject = object || {};
            return Newton.SimpleObject.fromJSONObject(newObject);
        } catch(err){
            logger.warn('NewtonAdapter', 'Newton.SimpleObject.fromJSONObject is failed', err);
            return Newton.SimpleObject.fromJSONObject({});
        }
        
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
    * @param {boolean} [options.enable=false] enable calls to Newton library
    * @param {boolean} [options.waitLogin=false] tracking, heartbeats and other Newton calls wait login (both logged and unlogged users)
    * @param {boolean} [options.waitDeviceReady=false] wait deviceReady event to initialize Newton library (for hybrid environment)
    * @param {integer} [options.newtonversion=2] version of Newton (1 or 2)
    * @param {Object} [options.logger=disabled logger] object containing the methods: debug, log, info, warn, error
    * @param {Object} [options.properties={}] custom data for Newton session (not supported for v1)
    *
    * @return {Promise} promise that will be resolved when the init has been completed, rejected only if Newton doesn't exists
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
    *       }
    *   }).then(function(){
    *       console.log('init success');
    *   }).catch(function(){
    *       console.log('init failed');
    *   });
    * </pre>
    */
    this.init = function(options){
        return new Promise(function(resolve, reject){  
            // get logger and newtonversion
            if(options.logger){
                logger = options.logger;
            }
            if(options.newtonversion){
                newtonversion = options.newtonversion;
            }

            // check if Newton exists
            if(!Newton){
                reject();
                logger.error('NewtonAdapter', 'Newton not exist');
            } else {

                var initNewton = function(){
                    // init Newton
                    if(newtonversion === 1){
                        newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId);
                        if(options.properties){
                            logger.warn('NewtonAdapter', 'Newton v.1 not support properties on init method');
                        }
                    } else {
                        newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId, createSimpleObject(options.properties));
                    }

                    // trigger init
                    resolve(true);
                    logger.log('NewtonAdapter', 'Init', options);
                    Bluebus.trigger('init');

                    // trigger login, if waitLogin is false
                    if(!options.waitLogin){
                        Bluebus.trigger('login');
                    }
                };

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
    * @description Performs Newton login
    *
    * @param {Object} options configuration object
    * @param {boolean} [options.logged=false] new state of the user
    * @param {string} [options.type="custom"] type of Newton login: custom (v1 supports only this), external, msisdn, autologin, oauth
    * @param {string} options.userId required for custom and external login
    * @param {Object} [options.userProperties={}] available only for custom and external login
    * @param {string} options.pin required for msisdn login
    * @param {string} options.msisdn required for msisdn login
    * @param {string} options.domain required for autologin login
    * @param {string} options.provider required for oauth login
    * @param {string} options.access_token required for oauth login
    *
    * @return {Promise} promise that will be resolved when the login has been completed, rejected if login failed or if one or more required parameters are missing
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
    *   }).catch(function(){
    *       console.log('login failed');
    *   });
    *
    * // for unlogged users
    * NewtonAdapter.login({
    *       logged: false
    * });
    * </pre>
    */
    this.login = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('init', function(){

                if(options.callback){
                    logger.warn('NewtonAdapter', 'Login', 'Callback method for login is not supported, use promise-then');
                }

                var callCallback = function(){
                    // trigger login
                    resolve();
                    logger.log('NewtonAdapter', 'Login', options);
                    Bluebus.trigger('login');
                };

                if(!options.logged || newtonInstance.isUserLogged()){                    
                    callCallback();
                } else {                    
                    var loginType = options.type ? options.type : 'custom';

                    // newton version 1
                    if(newtonversion === 1){
                        if(loginType === 'custom'){
                            if(options.userId){
                                newtonInstance.getLoginBuilder()
                                .setLoginData(createSimpleObject(options.userProperties))
                                .setCallback(callCallback)
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
                                .setOnFlowCompleteCallback(callCallback)
                                .setCustomID(options.userId)
                                .getCustomLoginFlow()
                                .startLoginFlow();  
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'Custom login requires userId');
                            }
                        } else if(loginType === 'external'){
                            if(options.userId){
                                newtonInstance.getLoginBuilder()
                                .setCustomData(createSimpleObject(options.userProperties))
                                .setOnFlowCompleteCallback(callCallback)
                                .setExternalID(options.userId)
                                .getExternalLoginFlow()
                                .startLoginFlow();
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'External login requires userId');
                            }
                        } else if(loginType === 'msisdn'){
                            if(options.msisdn && options.pin){
                                newtonInstance.getLoginBuilder()
                                .setOnFlowCompleteCallback(callCallback)
                                .setMSISDN(options.msisdn)
                                .setPIN(options.pin)
                                .getMSISDNPINLoginFlow()
                                .startLoginFlow();
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'Msisdn login requires msisdn and pin');
                            }
                        } else if(loginType === 'autologin'){
                            if(options.domain){
                                newtonInstance.getLoginBuilder()
                                .setOnFlowCompleteCallback(callCallback)
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
                                .setOnFlowCompleteCallback(callCallback)
                                .getOAuthLoginFlow()
                                .startLoginFlow();
                            } else {
                                reject();
                                logger.error('NewtonAdapter', 'Login', 'OAuth login requires provider and access_token');
                            }
                        } else {
                            reject();
                            logger.error('NewtonAdapter', 'Login', 'This type of login is unknown');
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
    * @description Performs logout from Newton 
    * <br/><b>This method is executed after init</b>
    *
    * @return {Promise} promise that will be resolved when the logout has been completed, rejected only if Newton logout failed
    *
    * @example
    * <pre>
    *   NewtonAdapter.logout().then(function(){
    *       console.log('logout success');
    *   }).catch(function(){
    *       console.log('logout failed');
    *   });
    * </pre>
    */
    this.logout = function(){
        return new Promise(function(resolve){
            Bluebus.bind('init', function(){
                if(newtonInstance.isUserLogged()){                    
                    newtonInstance.userLogout();
                    resolve();
                    logger.log('NewtonAdapter', 'Login');
                } else {                    
                    resolve();
                    logger.warn('NewtonAdapter', 'User is already unlogged');
                }
            });
        });
    };


    /**
    * @ngdoc function
    * @name rankContent
    * @methodOf NewtonAdapter
    *
    * @description Performs Newton content ranking
    * <br><b>This method is executed after login (if waitLogin:true) or after init (if waitLogin:false)</b>
    * <br><b>Newton version 1 don't support this feature</b>
    *
    * @param {Object} options configuration object
    * @param {string} options.contentId unique identifier of the content
    * @param {string} options.scope type of action performed on the content
    * @param {number} [options.score=1] the score associated to the content
    *
    * @return {Promise} promise that will be resolved when the rankContent has been completed, rejected for v1 or if one or more required parameters are missing
    *
    * @example
    * <pre>
    *   NewtonAdapter.rankContent({
    *       contentId: '123456777',
    *       scope: 'social',
    *       score: 4
    *   }).then(function(){
    *       console.log('rankContent success');
    *   }).catch(function(){
    *       console.log('rankContent failed');
    *   });
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
                    if(options.contentId && options.scope){
                        newtonInstance.rankContent(options.contentId, options.scope, score);
                        resolve();
                        logger.log('NewtonAdapter', 'rankContent', options);
                    } else {
                        reject();
                        logger.error('NewtonAdapter', 'rankContent', 'rankContent requires scope and contentId');
                    }
                }
            });
        });
    };

    /**
    * @ngdoc function
    * @name trackEvent
    * @methodOf NewtonAdapter
    *
    * @description Performs Newton track event
    * <br><b>This method is executed after login (if waitLogin:true) or after init (if waitLogin:false)</b>
    *
    * @param {Object} options configuration object
    * @param {string} options.name name of the event to track
    * @param {object} [options.properties={}] custom data of the event
    * @param {object} [options.rank={}] rank content data
    *
    * @return {Promise} promise that will be resolved when the track event has been completed, rejected if failed
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
    *   }).catch(function(){
    *       console.log('trackEvent failed');
    *   });
    * </pre>
    */
    this.trackEvent = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                if(options.name){
                    newtonInstance.sendEvent(options.name, createSimpleObject(options.properties));
                    resolve();
                    logger.log('NewtonAdapter', 'trackEvent', options);
                    
                    if(options.rank){
                        NewtonAdapter.rankContent(options.rank);
                    }
                } else {
                    reject();
                    logger.error('NewtonAdapter', 'trackEvent', 'trackEvent requires name');
                }
            });
        });
    };


    /**
    * @ngdoc function
    * @name trackPageview
    * @methodOf NewtonAdapter
    *
    * @description Performs Newton pageview tracking 
    * <br><b>This method is executed after login (if waitLogin:true) or after init (if waitLogin:false)</b>
    *
    * @param {Object} options configuration object
    * @param {Object} options.properties properties of the pageview
    * @param {string} [options.properties.url=window.location.href] url of pageview
    *
    * @return {Promise} promise that will be resolved when the trackPageview has been completed, rejected if track failed
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
    *   }).catch(function(){
    *       console.log('trackPageview failed');
    *   });
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
    * @description Performs Newton start timed event
    * <br><b>This method is executed after login (if waitLogin:true) or after init (if waitLogin:false)</b>
    *
    * @param {Object} options configuration object
    * @param {string} options.name name of the timed event
    * @param {Object} [options.properties={}] properties of the timed event
    *
    * @return {Promise} promise that will be resolved when the startHeartbeat has been completed, rejected if failed
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
    *   }).catch(function(){
    *       console.log('startHeartbeat failed');
    *   });
    * </pre>
    */
    this.startHeartbeat = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                if(options.name){
                    newtonInstance.timedEventStart(options.name, createSimpleObject(options.properties));
                    resolve();
                    logger.log('NewtonAdapter', 'startHeartbeat', options);
                } else {
                    reject();
                    logger.error('NewtonAdapter', 'startHeartbeat', 'startHeartbeat requires name');
                }                         
            });
        });
    };


    /**
    * @ngdoc function
    * @name stopHeartbeat
    * @methodOf NewtonAdapter
    *
    * @description Performs Newton stop timed event
    * <br><b>This method is executed after login (if waitLogin:true) or after init (if waitLogin:false)</b>
    *
    * @param {Object} options configuration object
    * @param {string} options.name name of the timed event
    * @param {Object} [options.properties={}] properties of the timed event
    *
    * @return {Promise} promise that will be resolved when the stopHeartbeat has been completed, rejected if failed
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
    *   }).catch(function(){
    *       console.log('stopHeartbeat failed');
    *   });
    * </pre>
    */
    this.stopHeartbeat = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                if(options.name){
                    newtonInstance.timedEventStop(options.name, createSimpleObject(options.properties));
                    resolve();
                    logger.log('NewtonAdapter', 'startHeartbeat', options);
                } else {
                    reject();
                    logger.error('NewtonAdapter', 'startHeartbeat', 'startHeartbeat requires name');
                }                 
            });
        });
    };


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
    * <br><b>Synchronous call, don't wait init</b>
    *
    * @return {boolean} true if init has been called, else false
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
    * <br><b>Synchronous call, don't wait init</b>
    *
    * @return {string} Newton user token or false if init has not been called before
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
    this.setUserStateChangeListener = function(callback){
        if(newtonInstance && callback){
            newtonInstance.setUserStateChangeListener(callback);
            return true;
        } else {
            return false;
        }
    };


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
    this.finalizeLoginFlow = function(callback){
        if(newtonInstance && callback){
            newtonInstance.finalizeLoginFlow(callback);
            return true;
        } else {
            return false;
        }
    };


    /**
    * @ngdoc function
    * @name addIdentity
    * @methodOf NewtonAdapter
    *
    * @description Add identity to an user
    * <br><b>This method is executed after login (if waitLogin:true) or after init (if waitLogin:false)</b>
    *
    * @param {Object} options configuration object
    * @param {string} [options.type='auth'] type of identity to add (support only 'oauth' now)
    * @param {string} options.provider provider of identity to add
    * @param {string} options.access_token access token of identity to add
    *
    * @return {Promise} promise that will be resolved when the addIdentity has been completed, rejected if failed
    *
    * @example
    * <pre>
    *   NewtonAdapter.addIdentity({
    *       type: 'oauth',
    *       provider: 'Facebook',
    *       access_token: '1234567890'
    *   }).then(function(){
    *       console.log('addIdentity success');
    *   }).catch(function(){
    *       console.log('addIdentity failed');
    *   });
    * </pre>
    */
    this.addIdentity = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){

                var identityType = options.type ? options.type : 'oauth';
                if(identityType === 'oauth'){
                    if(options.provider && options.access_token){
                        newtonInstance.getIdentityManager()
                        .getIdentityBuilder()
                        .setOAuthProvider(options.provider)
                        .setAccessToken(options.access_token)
                        .setOnFlowCompleteCallback(function(){
                            resolve();
                            logger.log('NewtonAdapter', 'addIdentity', options);
                        })
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

    /**
    * @ngdoc function
    * @name removeIdentity
    * @methodOf NewtonAdapter
    *
    * @description Remove identity from an user
    * <br><b>This method is executed after login (if waitLogin:true) or after init (if waitLogin:false)</b>
    *
    * @param {Object} options configuration object
    * @param {string} options.type type of identity to remove
    *
    * @return {Promise} promise that will be resolved when the removeIdentity has been completed, rejected if removeIdentity failed
    *
    * @example
    * <pre>
    *   NewtonAdapter.removeIdentity({
    *       type: 'oauth'
    *   }).then(function(){
    *       console.log('removeIdentity success');
    *   }).catch(function(){
    *       console.log('removeIdentity failed');
    *   });
    * </pre>
    */
    this.removeIdentity = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                if(options.type){
                    newtonInstance.getIdentityManager().getIdentities(function(err, identities){
                        if(err){ 
                            reject();
                            logger.error('NewtonAdapter', 'removeIdentity', err);
                        } else {
                            for(var i = 0; i < identities.length; i++) {
                                if (options.type === identities[i].getType()){
                                    identities[i].delete();
                                }
                            }
                            resolve();
                            logger.log('NewtonAdapter', 'removeIdentity', options, identities);
                        }
                    });
                } else {
                    reject();
                    logger.error('NewtonAdapter', 'removeIdentity', 'removeIdentity requires type');
                }                
            });
        });
    };


    /**
    * @ngdoc function
    * @name userDelete
    * @methodOf NewtonAdapter
    *
    * @description Delete an user
    * <br><b>This method is executed after login (if waitLogin:true) or after init (if waitLogin:false)</b>
    *
    * @return {Promise} promise that will be resolved when the userDelete has been completed, rejected if userDelete failed
    *
    * @example
    * <pre>
    *   NewtonAdapter.userDelete().then(function(){
    *       console.log('userDelete success');
    *   }).catch(function(){
    *       console.log('userDelete failed');
    *   });
    * </pre>
    */
    this.userDelete = function(){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                newtonInstance.getIdentityManager().getIdentities(function(err, identities){
                    if(err){ 
                        reject();
                        logger.error('NewtonAdapter', 'userDelete', err);
                    } else {
                        for (var i = 0; i < identities.length; i++) {
                            if (identities[i].getType() === 'msisdn'){
                                reject();
                                logger.error('NewtonAdapter', 'userDelete', 'Error on userDelete: please use unsubscribe instead');
                            }
                        }
                        newtonInstance.getIdentityManager().userDelete(function(){
                            resolve();
                            logger.log('NewtonAdapter', 'userDelete', identities);
                        });
                    }
                });            
            });
        });
    };
};

module.exports = NewtonAdapter;
