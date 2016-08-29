var PromiseLite = require('promiselite');

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

    /**
    * @ngdoc function
    * @name init
    * @methodOf NewtonAdapter
    *
    * @description Initializes Newton sdk and sets up internal configuration
    *
    * @param {Object} options configuration object
    * @param {string} options.secretId secret id of the application
    * @param {boolean} options.enable true if and only if Newton tracking is enabled
    * @param {boolean} options.waitLogin true if you want to track events only after login
    * @param {Object} options.logger any object containing the following methods: debug, log, info, warn, error
    * @param {Object} options.properties custom data for Newton
    * 
    * @example
    * <pre>
    *   NewtonAdapter.init({
    *       secretId: '123456789',
    *       enable: true,      // enable newton
    *       waitLogin: true,    // wait for login to have been completed (async)
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

        // init enablePromise and init Newton
        enablePromise.then(function(){
            newtonInstance = Newton.getSharedInstanceWithConfig(options.secretId, createSimpleObject(options.properties));
            logger.log('NewtonAdapter', 'Init', options);
        });
        enablePromise.fail(function(){});

        // check if enabled
        var isNewtonExist = !!window.Newton;
        if(!isNewtonExist){
            logger.warn('Newton not exist');
            enablePromise.reject();
        } else if(options.enable){
            enablePromise.resolve();
        } else {
            logger.warn('Newton not enabled');
            enablePromise.reject();
        }

        // init loginPromise
        loginPromise.fail(function(error){
            logger.warn('Newton login not called', error);
        });

        // resolve loginPromise if not waitLogin and enable
        if(!options.waitLogin && options.enable){
            loginPromise.resolve();
        }
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


    /**
    * @ngdoc function
    * @name rankContent
    * @methodOf NewtonAdapter
    *
    * @description performs content ranking via Newton sdk
    *
    * @param {Object} options configuration object
    * @param {string} contentId unique identifier of the content
    * @param {string} scope type of action performed on the content
    * @param {number} score the score associated to the content
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
            newtonInstance.rankContent(options.contentId, options.scope, options.score);
            logger.log('NewtonAdapter', 'rankContent', options);
        });
    };

    /**
    * @ngdoc function
    * @name trackEvent
    * @methodOf NewtonAdapter
    *
    * @description performs event tracking via Newton sdk
    *
    * @param {Object} options configuration object
    * @param {string} options.name name of the event to track
    * @param {object} options.properties custom datas of the event
    * @param {object} options.rank rank event datas
    *
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
                newtonInstance.rankContent(options.rank.contentId, options.rank.scope, options.rank.score);
                logger.log('NewtonAdapter', 'rankContent', options.rank);
            }
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
    * @param {Object} [options.properties] Properties of the pageview
    * @param {string} [options.properties.url=window.location.href] url of pageview
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
        NewtonAdapter.trackEvent(options);
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
    * @name isUserLogged
    * @methodOf NewtonAdapter
    *
    * @description returns whether the user is already logged on Newton
    *
    * @return {boolean} true if and only if the user is already logged on Newton
    *
    * @example
    * <pre>
    * NewtonAdapter.isUserLogged();
    * </pre>
    */
    this.isUserLogged = function(){
        return Newton.getSharedInstance().isUserLogged();
    };
};

module.exports = NewtonAdapter;