var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');
var currentFlow = require('./flowState');

/**
* @ngdoc function
* @name flowStep
* @methodOf NewtonAdapter
*
* @description Performs Newton new step of analytics flow<br>
* <b>This method is executed after flowBegin Newton's method</b>
*
* @param {Object} options configuration object
* @param {string} options.name name of the step flow
* @param {Object} [options.properties={}] additional properties for tracking
*
* @return {Promise} promise will be resolved when flow step is added, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.flowStep({
*       name: 'onBoarding1',
*       properties: {
*           type: 'slide'
*       }
*   }).then(function(){
*       console.log('Flow Step with success');
*   }).catch(function(err){
*       console.log('Flow Step failed', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            if(options && options.name && currentFlow.isFlowStarted()){
                Global.newtonInstance.flowStep(
                    options.name,
                    Utility.createSimpleObject(options.properties)
                );
                resolve();
                Global.logger.log('NewtonAdapter', 'flowStep', options);
            } else {
                reject('flowStep requires name or flow not started!');
                Global.logger.error('NewtonAdapter', 'flowStep', 'flowStep requires name or flow not started!');
            }
        });
    });
};