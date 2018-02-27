/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');

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
* @param {Function} [options.config={}] required whiteLabel (string), isInternational(boolean), and ravenInstance (optional). NB: If you just define whiteLabel and not isInternational newton will generate an exception!
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
*       config: {
*           whiteLabel: 'ww',
*           isInternational: true,
*           ravenInstance: {}    
*       },
*       properties: {
*           hello: 'World'
*       }
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
                    if (options.config) { args.push(options.config); }
                    // if (options.pushCallback) { args.push(options.pushCallback); }
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