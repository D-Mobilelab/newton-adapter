/* eslint-env browser */
/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');

/**
* @ngdoc object
* @name NewtonAdapter
*
* @description
* Adapter for Newton sdk to be used in B! web applications
*/
var NewtonAdapter = new function(){

    var newtonversion, newtonInstance, logger, beforeInit;

    var createSimpleObject = function(object){
        try {
            var newObject = object || {};
            return Newton.SimpleObject.fromJSONObject(newObject);
        } catch(err){
            logger.warn('NewtonAdapter', 'Newton.SimpleObject.fromJSONObject is failed', err);
            return Newton.SimpleObject.fromJSONObject({});
        }

    };

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
                reject('Newton not exist');
                logger.error('NewtonAdapter', 'Init', 'Newton not exist');
            } else {

                var initNewton = function(){
                    // init Newton
                    if(newtonversion === 1){
                        newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId);
                        if(options.properties){
                            logger.warn('NewtonAdapter', 'Init', 'Newton v.1 not support properties on init method');
                        }
                    } else {
                        var args = [options.secretId, createSimpleObject(options.properties)];
                        if (options.pushCallback) { args.push(options.pushCallback); }
                        newtonInstance = Newton.getSharedInstanceWithConfig.apply(null, args);
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
                    logger.warn('NewtonAdapter', 'Init', 'Newton not enabled');
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
    * @param {string} [options.type="custom"] (custom, external, msisdn, autologin or oauth)
    * @param {string} options.userId required for custom and external login
    * @param {Object} [options.userProperties={}] available only for custom and external login
    * @param {string} options.pin required for msisdn login
    * @param {string} options.msisdn required for msisdn login
    * @param {string} options.domain required for autologin login
    * @param {string} options.provider required for oauth login
    * @param {string} options.access_token required for oauth login
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
    this.login = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('init', function(){

                if(options.callback){
                    logger.warn('NewtonAdapter', 'Login', 'Callback method for login is not supported, use promise-then');
                }

                var callCallback = function(err){
                    if(err){
                        reject(err);
                        logger.error('NewtonAdapter', 'Login', err);
                    } else {
                        resolve();
                        logger.log('NewtonAdapter', 'Login', options);
                        Bluebus.trigger('login');
                    }
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
                                reject('Custom login requires userId');
                                logger.error('NewtonAdapter', 'Login', 'Custom login requires userId');
                            }
                        } else {
                            reject('Newton v.1 not support this type of login');
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
                                reject('Custom login requires userId');
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
                                reject('External login requires userId');
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
                                reject('Msisdn login requires msisdn and pin');
                                logger.error('NewtonAdapter', 'Login', 'Msisdn login requires msisdn and pin');
                            }
													} else if(loginType === 'generic'){
  	                            if(options.username && options.password){
  	                                newtonInstance.getLoginBuilder()
  	                                .setOnFlowCompleteCallback(callCallback)
																		.setUsername(options.username)
		                                .setPassword(options.password)
  	                                .getGenericLoginFlow()
  	                                .startLoginFlow();
  	                            } else {
  	                                reject('Email login requires email and password');
  	                                logger.error('NewtonAdapter', 'Login', 'Email login requires email and password');
  	                            }
                        } else if(loginType === 'autologin'){
                            if(options.domain){
                                newtonInstance.getLoginBuilder()
                                .setOnFlowCompleteCallback(callCallback)
                                .__setDomain(options.domain)
                                .getMSISDNURLoginFlow()
                                .startLoginFlow();
                            } else {
                                reject('Autologin requires domain');
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
                                reject('OAuth login requires provider and access_token');
                                logger.error('NewtonAdapter', 'Login', 'OAuth login requires provider and access_token');
                            }
                        } else {
                            reject('This type of login is unknown');
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
    * @return {Promise} promise will be resolved when logout is completed, rejected if failed
    *
    * @example
    * <pre>
    *   NewtonAdapter.logout().then(function(wasLogged){
    *       console.log('logout success', wasLogged);
    *   })
    * </pre>
    */
    this.logout = function(){
        return new Promise(function(resolve){
            Bluebus.bind('init', function(){
                if(newtonInstance.isUserLogged()){
                    newtonInstance.userLogout();
                    resolve(true);
                    logger.log('NewtonAdapter', 'Logout');
                } else {
                    resolve(false);
                    logger.warn('NewtonAdapter', 'Logout', 'User is already unlogged');
                }
            });
        });
    };


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
    this.rankContent = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                var score = options.score ? options.score : 1;
                if(newtonversion === 1){
                    reject('Newton v.1 not support rank content');
                    logger.error('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
                } else {
                    if(options.contentId && options.scope){
                        newtonInstance.rankContent(options.contentId, options.scope, score);
                        resolve();
                        logger.log('NewtonAdapter', 'rankContent', options);
                    } else {
                        reject('rankContent requires scope and contentId');
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
                    reject('trackEvent requires name');
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
    this.startHeartbeat = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                if(options.name){
                    newtonInstance.timedEventStart(options.name, createSimpleObject(options.properties));
                    resolve();
                    logger.log('NewtonAdapter', 'startHeartbeat', options);
                } else {
                    reject('startHeartbeat requires name');
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
    this.stopHeartbeat = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                if(options.name){
                    newtonInstance.timedEventStop(options.name, createSimpleObject(options.properties));
                    resolve();
                    logger.log('NewtonAdapter', 'startHeartbeat', options);
                } else {
                    reject('startHeartbeat requires name');
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


			this.getIdentities = function(callback){
				newtonInstance.getIdentityManager().getIdentities(callback);
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

		this.confirmEmailAndLogin = function(options){

			return new Promise(function(resolve, reject){
					Bluebus.bind('init', function(){

						console.log('confirm options',options);

						newtonInstance.getLoginBuilder()
						.setOnFlowCompleteCallback(function(err) {
							console.log('Email Confirm is ended', arguments);
							if(err){
									reject(err);
									logger.error('NewtonAdapter', 'confirmEmailAndLogin', err);
							} else {
									resolve();
									logger.log('NewtonAdapter', 'confirmEmailAndLogin', options);
							}
						})
						.setEmailToken(options.token)
						.getEmailConfirmFlow()
						.startLoginFlow();
					});
				});
		};

    /**
    * @ngdoc function
			* @name confirmEmail
			* @methodOf NewtonAdapter
			*
			* @description Confirm email identity to an user
			* <br><b>This method is executed after init </b>
			*
			* @param {Object} options configuration object
			* @param {string} [options.token] type of identity to add (support only 'oauth' now)
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
			this.confirmEmail = function(options){

				return new Promise(function(resolve, reject){
						Bluebus.bind('init', function(){

							newtonInstance.confirmEmail(options.token, function(err) {
								if(err){
										reject(err);
										logger.error('NewtonAdapter', 'confirmEmail', err);
								} else {
										console.log('confirm OK');
										resolve();
										logger.log('NewtonAdapter', 'confirmEmail', options);
								}
        			});

						});
					});
			};

			this.resetPassword = function(options){

				return new Promise(function(resolve, reject){
						Bluebus.bind('init', function(){
							if(!!options.password && options.token){
								newtonInstance.resetPassword(options.token, options.password, function(err){
									if(err){
											reject(err);
											logger.error('NewtonAdapter', 'resetPassword', err);
									} else {
											resolve();
											logger.log('NewtonAdapter', 'resetPassword', options);
									}
	        			});
							} else {
								logger.error('NewtonAdapter', 'resetPassword', 'resetPassword requires password and token');
								reject('resetPassword requires password and token');
							}

						});
					});
			};


			this.forgotEmailConfirm = function(options){

				return new Promise(function(resolve, reject){
						Bluebus.bind('init', function(){
							if(!!options.password && options.token){
								newtonInstance.getLoginBuilder()
								.setOnFlowCompleteCallback(function() {
									if(err){
											logger.error('NewtonAdapter', 'confirmEmailForgot err', err);
											reject(err);
									} else {
											logger.log('NewtonAdapter', 'confirmEmailForgot ok', options);
											resolve();
									}
					      })
					      .setPassword(options.password)
					      .setForgotToken(options.token)
					      .getEmailConfirmForgotFlow()
					      .startForgotFlow();
							} else {
								logger.error('NewtonAdapter', 'forgotEmailConfirm', 'forgotEmailConfirm requires password and token');
								reject('forgotEmailConfirm requires password and token');
							}
						});
					});
			};

			/**
			* @ngdoc function
    * @name addIdentity
    * @methodOf NewtonAdapter
    *
    * @description Add identity to an user<br>
    * <b>This method is executed after login (waitLogin:true) or after init (false)</b>
    *
    * @param {Object} options configuration object
    * @param {string} [options.type='oauth'] type of identity to add (support only 'oauth' now)
    * @param {string} options.provider provider of identity to add
    * @param {string} options.access_token access token of identity to add
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
                        .setOnFlowCompleteCallback(function(err){
                            if(err){
                                reject(err);
                                logger.error('NewtonAdapter', 'addIdentity', err);
                            } else {
                                resolve();
                                logger.log('NewtonAdapter', 'addIdentity', options);
                            }
                        })
                        .getAddOAuthIdentityFlow()
                        .startAddIdentityFlow();
                    } else {
                        reject('addIdentity requires provider and access_token');
                        logger.error('NewtonAdapter', 'addIdentity', 'addIdentity requires provider and access_token');
                    }
                  } else if(identityType === 'email'){

                    if(!options.emailParams)
                      options.emailParams={};

                    if(options.email && options.password){
                        newtonInstance.getIdentityManager()
                        .getIdentityBuilder()
                        .setEmail(options.email)
                        .setPassword(options.password)
                        .setProductEmailParams(createSimpleObject(options.params))
                        .setOnFlowCompleteCallback(function(err){
                            if(err){
                                reject(err);
                                logger.error('NewtonAdapter', 'addEmailIdentity', err);
                            } else {
                                resolve();
                                logger.log('NewtonAdapter', 'addEmailIdentity', options);
                            }
                        })
                        .getAddEmailIdentityFlow()
                        .startAddIdentityFlow();
                    } else {
                        reject('addEmailIdentity requires email and password');
                        logger.error('NewtonAdapter', 'addEmailIdentity', 'addEmailIdentity requires email and password');
                    }
                  } else if(identityType === 'generic'){

                      newtonInstance.getIdentityManager()
                       .getIdentityBuilder()
                       .setOnFlowCompleteCallback(function(err){
                            if(err){
                                reject(err);
                                logger.error('NewtonAdapter', 'addEmailIdentity', err);
                            } else {
                                resolve();
                                logger.log('NewtonAdapter', 'addEmailIdentity', options);
                            }
                        })
                        .setSMSTemplate(options.smsTemplate)
                        .getAddGenericIdentityFlow()
                        .startAddIdentityFlow();

                } else {
                    reject('This type of add identity is not supported');
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
    * @description Remove identity from an user<br>
    * <b>This method is executed after login (waitLogin:true) or after init (false)</b>
    *
    * @param {Object} options configuration object
    * @param {string} options.type type of identity to remove
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
    this.removeIdentity = function(options){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                if(options.type){
                    newtonInstance.getIdentityManager().getIdentities(function(identError, identities){
                        if(identError){
                            reject(identError);
                            logger.error('NewtonAdapter', 'removeIdentity', 'getIdentities failed', identError);
                        } else {
                            logger.log('NewtonAdapter', 'removeIdentity', 'getIdentities success', options, identities);
                            if(identities.length < 2){
                                reject('it\'s not possible remove unique identity');
                                logger.error('NewtonAdapter', 'removeIdentity', 'it\'s not possible remove unique identity');
                            } else {
                                for(var i = 0, goFoward = true; i < identities.length && goFoward; i++){
                                    if (options.type === identities[i].getType()){
                                        goFoward = false;
                                        identities[i].delete(function(deleteError){
                                            if(deleteError){
                                                reject(deleteError);
                                                logger.error('NewtonAdapter', 'removeIdentity', 'delete failed', deleteError);
                                            } else {
                                                resolve();
                                                logger.log('NewtonAdapter', 'removeIdentity', 'delete success');
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    });
	             }else if(options.identity){
										options.identity.delete(function(deleteError){
											if(deleteError){
												reject(deleteError);
												logger.error('NewtonAdapter', 'removeIdentity', 'delete failed', deleteError);
                      } else {
												resolve();
												logger.log('NewtonAdapter', 'removeIdentity', 'delete success');
                      }
                    });
							 } else {
	                 reject('removeIdentity requires type or identity object');
	                 logger.error('NewtonAdapter', 'removeIdentity', 'removeIdentity requires type or identity object');
	              }
        });
	        });
    };


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
    this.userDelete = function(){
        return new Promise(function(resolve, reject){
            Bluebus.bind('login', function(){
                newtonInstance.getIdentityManager().getIdentities(function(identError, identities){
                    if(identError){
                        reject(identError);
                        logger.error('NewtonAdapter', 'userDelete', 'getIdentities failed', identError);
                    } else {
                        logger.log('NewtonAdapter', 'userDelete', 'getIdentities success', identities);
                        for(var i = 0, goFoward = true; i < identities.length && goFoward; i++){
                            if (identities[i].getType() === 'msisdn'){
                                goFoward = false;
                                reject('Error on userDelete: please use unsubscribe instead');
                                logger.error('NewtonAdapter', 'userDelete', 'Error on userDelete: please use unsubscribe instead');
                            }
                        }
                        newtonInstance.getIdentityManager().userDelete(function(deleteError){
                            if(deleteError){
                                reject(deleteError);
                                logger.error('NewtonAdapter', 'userDelete', 'delete', deleteError);
                            } else {
                                resolve();
                                logger.log('NewtonAdapter', 'userDelete', identities);
                            }
                        });
                    }
                });
            });
        });
    };

    /**
    * @ngdoc function
    * @name recoverPassword
    * @methodOf NewtonAdapter
    *
    * @description Recover password of a user<br>
    * <b>This method is executed after login (waitLogin:true) or after init (false)</b>
    *
    * @param {Object} options configuration object
    * @param {string} options.msisdn msisdn of the user
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
    this.recoverPassword = function(options){
        return new Promise(function(resolve, reject){
	            Bluebus.bind('init', function(){
									// msisdn
                if(options.msisdn){
										logger.log('recover pin flow');
                    newtonInstance.getLoginBuilder()
                    .setOnForgotFlowCallback(function(err){
                        if(err){
                            reject(err);
                            logger.error('NewtonAdapter', 'recoverPassword', err);
                        } else {
                            resolve();
                            logger.log('NewtonAdapter', 'recoverPassword', options);
                        }
                    })
                    .setMSISDN(options.msisdn)
                    .getMSISDNPINForgotFlow()
                    .startForgotFlow();
									// email
									} else if(options.email){
													logger.log('recover email password flow');
			                    newtonInstance.getLoginBuilder()
			                    .setOnForgotFlowCallback(function(err){
			                        if(err){
			                            reject(err);
																	logger.error('NewtonAdapter', 'emailRecoverPassword', err);
                } else {
			                            resolve();
																	logger.log('NewtonAdapter', 'emailRecoverPassword', options);
                }
			                    })
			                    .setEmail(options.email)
			                    .getEmailForgotFlow()
			                    .startForgotFlow();
	                } else {
	                    reject('recoverPassword requires msisdn or email');
	                    logger.error('NewtonAdapter', 'recoverPassword', 'recoverPassword requires msisdn or email');
	                }
            });
        });
    };
};

module.exports = NewtonAdapter;
