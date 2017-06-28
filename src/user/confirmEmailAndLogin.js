/* eslint-env browser */
/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name confirmEmailAndLogin
* @methodOf NewtonAdapter
*
* @description Confirm email flow and login to the service
*
* @param {Object} options configuration object
* @param {string} options.token token to confirm email
* @param {Object} [options.properties={}] properties of the timed event
*
* @return {Promise} promise will be resolved when stop is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.confirmEmailAndLogin({
*       token: '123456'
*   }).then(function(){
*       console.log('confirmEmailAndLogin success');
*   }).catch(function(err){
*       console.log('confirmEmailAndLogin failed', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('init', function(){
            Global.newtonInstance.getLoginBuilder().setOnFlowCompleteCallback(function(err) {
                if(err){
                    reject(err);
                    Global.logger.error('NewtonAdapter', 'confirmEmailAndLogin', err);
                } else {
                    resolve();
                    Global.logger.log('NewtonAdapter', 'confirmEmailAndLogin', options);
                }
            })
            .setEmailToken(options.token)
            .getEmailConfirmFlow()
            .startLoginFlow();
        });
    });
};