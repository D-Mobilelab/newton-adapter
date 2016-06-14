var PromiseLite = require('../node_modules/promiselite/src/promiselite.js');

/**
* @ngdoc object
* @name NewtonAdapter
*
* @description
* Adapter for Newton sdk to be used in B! web applications
*/
var NewtonAdapter = new function(){

    var newtonInstance, logger;
    var enablePromise = new PromiseLite(); 
    var initPromise = new PromiseLite(); 
    var loginPromise = new PromiseLite(); 
    
    enablePromise.fail(function(){
        logger.warn('Newton not enabled');
    });

    initPromise.fail(function(){
        logger.warn('Newton not initialized');
    });

    loginPromise.fail(function(){
        logger.warn('Newton login not called');
    });

    /**
    * @ngdoc function
    * @name init
    * @methodOf NewtonAdapter
    *
    * @description Initializes Newton sdk and sets up internal configuration
    *
    * @param {Object} options configuration object
    * @param {string} options.secretId secret id of the application
    * @param {boolean} options.enabled true if and only if Newton tracking is enabled
    * @param {Logger} options.logger any object containing the following methods: debug, log, info, warn, error
    * 
    * @example
    * <pre>
    *   NewtonAdapter.init({
    *       secretId: '123456789',
    *       enabled: true,      // enable newton
    *       waitLogin: true,    // wait for login to have been completed (async)
    *       logger: console
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

        // check if enabled
        if (options.enable){
            enablePromise.resolve();
        } else {
            enablePromise.reject();
        }

        // check if login is required
        if(!options.waitLogin){
            loginPromise.resolve();
        }

        // init newton and resolve initPromise
        enablePromise.then(function(){
            newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId);
            initPromise.resolve();
            logger.log('NewtonAdapter', 'Init', options);
        });
    };


    var createSimpleObject = function(object){
        object = object || {};
        return Newton.SimpleObject.fromJSONObject(object);
    };

    /**
    * @ngdoc function
    * @name login
    * @methodOf NewtonAdapter
    *
    * @description performs custom or external login via Newton sdk
    *
    * @param {Object} options configuration object
    * @param {string} options.type allowed values: 'custom' or 'external'
    * @param {boolean} options.logged true if and only if the user is logged on the product
    * @param {Object} options.userProperties an object containing data about the user
    * @return {PromiseLite} promise that will be resolved when the login has been completed
    *
    * @example
    * <pre>
    * NewtonAdapter.login({
    *       logged: true,       // is user logged?
    *       type: 'external'        // 'external' or 'custom'
    *       userId: '123456789',    // mandatory for logged user
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
                loginPromise.resolve();
            } catch(err) {
                logger.error('NewtonAdapter', 'Login', err);
                loginPromise.reject();
            }
        };

        initPromise.then(function(){
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
                    .setCustomData(options.userProperties)
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

    /**
    * @ngdoc function
    * @name trackEvent
    * @methodOf NewtonAdapter
    *
    * @description performs event tracking via Newton sdk
    *
    * @param {Object} options configuration object
    *
    * @example
    * <pre>
    * NewtonAdapter.trackEvent({
    *       name: 'Play',
    *       properties: {
    *           category: 'Game',
    *           content: 'Fruit Slicer'
    *       }
    * });
    * </pre>
    */
    this.trackEvent = function(options){
        loginPromise.then(function(){
            newtonInstance.sendEvent(options.name, createSimpleObject(options.properties));
            logger.log('NewtonAdapter', 'trackEvent', options.name, options.properties);
        });
    };

    /**
    * @ngdoc function
    * @name trackPageview
    * @methodOf NewtonAdapter
    *
    * @description performs pageview tracking via Newton sdk
    *
    * @param {Object} options configuration object
    * @param {string} [options.url=window.location.href] url of the page we want to track
    *
    * @example
    * <pre>
    * NewtonAdapter.trackPageview({
    *       title: 'Fruit Page',
    *       url: 'http://www.google.it'
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
        this.trackEvent(options);
    };

    /**
    * @ngdoc function
    * @name startHeartbeat
    * @methodOf NewtonAdapter
    *
    * @description performs timed events via Newton sdk
    *
    * @param {Object} options configuration object
    * @param {string} options.name name of the timed event
    * @param {Object} options.properties details of the timed event
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
    };

    /**
    * @ngdoc function
    * @name stopHeartbeat
    * @methodOf NewtonAdapter
    *
    * @description stops timed events via Newton sdk
    *
    * @param {Object} options configuration object
    * @param {string} options.name name of the timed event
    * @param {Object} options.properties details of the timed event
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
    };

    /**
    * @ngdoc function
    * @name isLogged
    * @methodOf NewtonAdapter
    *
    * @description returns whether the user is already logged on Newton
    *
    * @return {boolean} true if and only if the user is already logged on Newton
    *
    * @example
    * <pre>
    * NewtonAdapter.isLogged();
    * </pre>
    */
    this.isLogged = function(){
        if (!loginPromise.isSettled()){
            return false;
        }
        return Newton.getSharedInstance().isUserLogged();
    };
};

module.exports = NewtonAdapter;