/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');
var rankContent = require('./rankContent');

/**
* @ngdoc function
* @name setLogView
* @methodOf NewtonAdapter
*
* @description Initialize LogView, passing paramenters<br>
* <b>This method is executed after init</b>
*
* @param {Object} options logview configuration object
*
* @return {Promise} promise will be resolved when set is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.setLogView({
*           endpoint: 'endpoint-xxx',
*           uid: 'uid-xxx',
*           label: 'label-xxx',
*           pid: 'pid-xxx'
*   }).then(function(){
*       console.log('setLogView success');
*   }).catch(function(err){
*       console.log('setLogView failed', err);
*   });
* </pre>
*/
module.exports = function(properties){
    return new Promise(function(resolve, reject){
        Bluebus.bind('init', function(){
            if(properties && Global.newtonInstance.setLogViewInfo){
                Global.newtonInstance.setLogViewInfo(properties);
                resolve();
                Global.logger.log('NewtonAdapter', 'setLogView', properties);
            } else if(!properties) {
                reject('setLogView requires properties');
                Global.logger.error('NewtonAdapter', 'setLogView', 'setLogView requires properties');
            } else {
                reject('setLogViewInfo method is not present on Newton SDK');
                Global.logger.error('NewtonAdapter', 'setLogView', 'setLogViewInfo method is not present on Newton SDK');
            }
        });
    });
};