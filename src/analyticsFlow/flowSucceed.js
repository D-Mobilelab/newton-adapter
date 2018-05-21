/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');
var currentFlow = require('./flowState');

/**
* @ngdoc function
* @name flowSucceed
* @methodOf NewtonAdapter
*
* @description End flow with success<br>
* <b>This method is executed after flow has been started to end it</b>
*
* @param {Object} options configuration object
* @param {string} options.name name of the starting flow
* @param {Object} [options.properties={}] additional properties for tracking
*
* @return {Promise} promise will be resolved when call is ended with success, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.flowSucceed({
*       name: 'goToStore',
*       properties: {
*           'device': 'ios'
*       }
*   }).then(function(){
*       console.log('Flow is ended with success');
*   }).catch(function(err){
*       console.log('Failed to close flow', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            if(options && options.name && currentFlow.isFlowStarted()){
                Global.newtonInstance.flowSucceed(options.name, Utility.createSimpleObject(options.properties));
                currentFlow.cleanCurrentFlow();
                
                resolve();
                Global.logger.log('NewtonAdapter', 'flowSucceed', options);
            } else {
                reject('flowSucceed failed');
                Global.logger.error('NewtonAdapter', 'flowSucceed', 'flowSucceed failed');
            }
        });
    });
};