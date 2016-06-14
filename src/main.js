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
			logger = console;
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
		});
	};

	/*
		NewtonAdapter.customLogin({
			logged: true				// is user logged?
		});
	*/
	this.customLogin = function(options){
		initPromise.then(function(){
			console.log('login');
			if(options.logged){
				Newton.getSharedInstance().getLoginBuilder()
	            .setCustomData()
	            .setOnFlowCompleteCallback(function(){
	            	loginPromise.resolve
	            })
	            .setCustomID()
	            .getCustomLoginFlow()
	            .startLoginFlow();
			} else {
				loginPromise.resolve();
			}
		});
	};

	this.externalLogin = function(options){

	};

	this.trackEvent = function(){
		loginPromise.then(function(){
			// ...
			console.log('trackEvent');
		});
	};

	this.trackPageView = function(){
		loginPromise.then(function(){
			// ...
		});
	};

	this.startHeartbeat = function(){
		loginPromise.then(function(){
			// ...
		});
	};

	this.stopHeartbeat = function(){
		loginPromise.then(function(){
			// ...
		});
	};

	this.isLogged = function(){
		loginPromise.then(function(){
			// ...
		});
	};
};

module.exports = NewtonAdapter;