var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');

/**
* @ngdoc function
* @name stopHeartbeat
* @methodOf NewtonAdapter
*
* @description Performs Newton stop timed event<br>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
*
* @param {Object} options configuration object
* @param {string} options.name name of the timed event
* @param {Object} [options.properties={}] properties of the timed event
*
* @return {Promise} promise will be resolved when stop is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.stopHeartbeat({
*       name: 'Playing',
*       properties: {
*           category: 'Game',
*           content: 'Fruit Slicer'
*       }
*   }).then(function(){
*       console.log('stopHeartbeat success');
*   }).catch(function(err){
*       console.log('stopHeartbeat failed', err);
*   });
* </pre>
*/
module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            if(options && options.name){
                Global.newtonInstance.timedEventStop(
                    options.name,
                    Utility.createSimpleObject(options.properties)
                );
                resolve();
                Global.logger.log('NewtonAdapter', 'StopHeartbeat', options);
            } else {
                reject('StopHeartbeat requires name');
                Global.logger.error('NewtonAdapter', 'StopHeartbeat', 'StopHeartbeat requires name');
            }
        });
    });
};