/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');

/**
* @ngdoc function
* @name startHeartbeat
* @methodOf NewtonAdapter
*
* @description Performs Newton start timed event<br>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
*
* @param {Object} options configuration object
* @param {string} options.name name of the timed event
* @param {Object} [options.properties={}] properties of the timed event
*
* @return {Promise} promise will be resolved when start is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.startHeartbeat({
*       name: 'Playing',
*       properties: {
*           category: 'Game',
*           content: 'Fruit Slicer'
*       }
*   }).then(function(){
*       console.log('startHeartbeat success');
*   }).catch(function(err){
*       console.log('startHeartbeat failed', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            if(options.name){
                Global.newtonInstance.timedEventStart(options.name, Utility.createSimpleObject(options.properties));
                resolve();
                Global.logger.log('NewtonAdapter', 'startHeartbeat', options);
            } else {
                reject('startHeartbeat requires name');
                Global.logger.error('NewtonAdapter', 'startHeartbeat', 'startHeartbeat requires name');
            }
        });
    });
};