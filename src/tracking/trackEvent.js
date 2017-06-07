/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');
var rankContent = require('./rankContent');

/**
* @ngdoc function
* @name trackEvent
* @methodOf NewtonAdapter
*
* @description Performs Newton track event<br>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
*
* @param {Object} options configuration object
* @param {string} options.name name of the event to track
* @param {object} [options.properties={}] custom data of the event
* @param {object} [options.rank={}] rank content data
*
* @return {Promise} promise will be resolved when tracking is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.trackEvent({
*       name: 'Play',
*       properties: {
*           category: 'Game',
*           content: 'Fruit Slicer'
*       },
*       rank: {
*           contentId: '123456777',
*           scope: 'social',
*           score: 4
*       }
*   }).then(function(){
*       console.log('trackEvent success');
*   }).catch(function(err){
*       console.log('trackEvent failed', err);
*   });
* </pre>
*/
module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            if(options.name){
                Global.newtonInstance.sendEvent(options.name, Utility.createSimpleObject(options.properties));
                resolve();
                Global.logger.log('NewtonAdapter', 'trackEvent', options);

                if(options.rank){
                    rankContent(options.rank);
                }
            } else {
                reject('trackEvent requires name');
                Global.logger.error('NewtonAdapter', 'trackEvent', 'trackEvent requires name');
            }
        });
    });
};