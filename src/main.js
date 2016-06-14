var PromiseLite = require('../node_modules/promiselite/src/promiselite.js');

var NewtonAdapter = new function(){

	var newtonInstance, logger;
	
	var enablePromise = new PromiseLite(); 
	enablePromise.fail(function(){
		logger.warn("Newton not enabled");
	});

	var initPromise = new PromiseLite(); 
	initPromise.fail(function(){
		logger.warn("Newton not initialized");
	});

	var loginPromise = new PromiseLite(); 
	loginPromise.fail(function(){
		logger.warn("Newton login not called");
	});

	/*
		NewtonAdapter.init({
			secretId: '123456789',
			enabled: true,				// enable newton
			waitLogin: true,			// wait Login
			logger: console
		});
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
	}

	/*
		NewtonAdapter.login({
			logged: true,				// is user logged?
			type: 'external'			// 'external' or 'custom'
			userId: '123456789',		// obbligatorio per utente loggato
										// (chiedere ai newtoniani)
			userProperties: {
				msisdn: '+39123456789',
				type: 'freemium'
			}
		}).then(function(){
			console.log('login ok');
		});
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
		}

		initPromise.then(function(){
			if(options.logged && !newtonInstance.isUserLogged()){
				if(options.type == 'external'){
					newtonInstance.getLoginBuilder()
					.setCustomData( createSimpleObject(options.userProperties) )
					.setOnFlowCompleteCallback(loginCallback)
					.setExternalID(options.userId)
					.getExternalLoginFlow()
					.startLoginFlow();
				} else {
					newtonInstance.getLoginBuilder()
		            .setCustomData(userProperties)
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
	}

	/*
		NewtonAdapter.trackEvent({
			name: 'Play',
			properties: {
				category: 'Game',
				content: 'Fruit Slicer'
			}
		});
	*/
	this.trackEvent = function(options){
		loginPromise.then(function(){
			newtonInstance.sendEvent(options.name, createSimpleObject(options.properties));
			logger.log('NewtonAdapter', 'trackEvent', options.name, options.properties);
		});
	};

	/*
		NewtonAdapter.trackPageview({
			title: 'Fruit Page',
			url: 'http://www.google.it'
		});
	*/
	this.trackPageview = function(options){
		options.name = "pageview";
		if(!options.properties){
			options.properties = {};
		}
		if(!options.properties.url){
			options.properties.url = window.location.href;
		}
		this.trackEvent(options);
	};

	/*
		NewtonAdapter.startHeartbeat({
			name: 'Playing',
			properties: {
				category: 'Game',
				content: 'Fruit Slicer'
			}
		});
	*/
	this.startHeartbeat = function(options){
		loginPromise.then(function(){
			logger.log('NewtonAdapter', 'startHeartbeat', options);
			Newton.getSharedInstance().timedEventStart(options.name, createSimpleObject(options.properties));
		});
	};

	/*
		NewtonAdapter.stopHeartbeat({
			name: 'Playing',
			properties: {
				category: 'Game',
				content: 'Fruit Slicer'
			}
		});
	*/
	this.stopHeartbeat = function(options){
		loginPromise.then(function(){
			Newton.getSharedInstance().timedEventStop(options.name, createSimpleObject(options.properties));
			logger.log('NewtonAdapter', 'stopHeartbeat', options);
		});
	};

	/*
		NewtonAdapter.isLogged();
	*/
	this.isLogged = function(){
		if (!loginPromise.isSettled()){
			return false;
		}
		return Newton.getSharedInstance().isUserLogged();
	};
};

module.exports = NewtonAdapter;