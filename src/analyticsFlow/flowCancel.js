/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');
var currentFlow = require('./flowState');

/**
* @ngdoc function
* @name flowCancel
* @methodOf NewtonAdapter
*
* @description End flow with failuer<br>
* <b>This method is executed when the flow has been interrupted by the user (as a skip tutorial button)</b>
*
* @param {Object} options configuration object
* @param {string} options.name name of the canceled flow
* @param {Object} [options.properties={}] additional properties for tracking
*
* @return {Promise} promise will be resolved when call is ended with success, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.flowCancel({
*       name: 'closeOnBoarding',
*       properties: {
*           'device': 'ios'
*       }
*   }).then(function(){
*       console.log('Flow is aborted by the user');
*   }).catch(function(err){
*       console.log('Failed to abort the flow', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            if(options && options.name && currentFlow.isFlowStarted()){
                Global.newtonInstance.flowCancel(options.name, Utility.createSimpleObject(options.properties));
                currentFlow.cleanCurrentFlow();
                resolve();
                Global.logger.log('NewtonAdapter', 'flowCancel', options);
            } else {
                reject('flowCancel failed');
                Global.logger.error('NewtonAdapter', 'flowCancel', 'flowCancel failed');
            }
        });
    });
};