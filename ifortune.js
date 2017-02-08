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
                switch(options.type){                                       // DONE, TO EDIT: 'autorecognize' login
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
            if(err){ logger.error('NewtonAdapter', 'AddIdentity', err); }
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
            if(err){ logger.error('NewtonAdapter', 'recoverPassword', err); }
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
    this.getUserToken = function(){                                 // DONE WITHOUT CHANGES
        return newtonInstance.getUserToken();
    };
    this.finalizeLoginFlow = function(callback){
        newtonInstance.finalizeLoginFlow(callback);
    };
    this.setUserStateChangeListener = function(callback){           // DONE WITHOUT CHANGES
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