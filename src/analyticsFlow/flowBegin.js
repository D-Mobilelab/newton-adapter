/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');
var currentFlow = require('./flowState');

/**
* @ngdoc function
* @name flowBegin
* @methodOf NewtonAdapter
*
* @description Performs Newton start analytics flow<br>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
*
* @param {Object} options configuration object
* @param {string} options.name name of the starting flow
* @param {Object} [options.properties={}] additional properties for tracking
*
* @return {Promise} promise will be resolved when flow is started, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.flowBegin({
*       name: 'onBoarding',
*       properties: {
*           type: 'clickNext'
*       }
*   }).then(function(){
*       console.log('Flow Begin with success');
*   }).catch(function(err){
*       console.log('Flow Begin failed', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            if(options && options.name && !currentFlow.isFlowStarted()){
                Global.newtonInstance.flowBegin(options.name, Utility.createSimpleObject(options.properties));
                currentFlow.setCurrentFlow(options);
                
                resolve();
                Global.logger.log('NewtonAdapter', 'flowBegin', options);
            } else {
                reject('flowBegin requires name');
                Global.logger.error('NewtonAdapter', 'flowBegin', 'flowBegin requires name');
            }
        });
    });
};