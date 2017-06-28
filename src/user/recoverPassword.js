/* eslint-env browser */
/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name recoverPassword
* @methodOf NewtonAdapter
*
* @description Recover password of a user<br>
*
* @param {Object} options configuration object
* @param {string} options.msisdn msisdn of the user
* @param {string} options.email email of the user
*
* @return {Promise} promise will be resolved when recovering is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.recoverPassword({
*       msidsn: '+391234567890'
*   }).then(function(){
*       console.log('recoverPassword success');
*   }).catch(function(err){
*       console.log('recoverPassword failed', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('init', function(){
            if(options.msisdn){
                Global.newtonInstance.getLoginBuilder()
                .setOnForgotFlowCallback(function(err){
                    if(err){
                        reject(err);
                        Global.logger.error('NewtonAdapter', 'recoverPassword', err);
                    } else {
                        resolve();
                        Global.logger.log('NewtonAdapter', 'recoverPassword', options);
                    }
                })
                .setMSISDN(options.msisdn)
                .getMSISDNPINForgotFlow()
                .startForgotFlow();
            } else if(options.email){
                Global.newtonInstance.getLoginBuilder()
                .setOnForgotFlowCallback(function(err){
                    if(err){
                        reject(err);
                        Global.logger.error('NewtonAdapter', 'emailRecoverPassword', err);
                    } else {
                        resolve();
                        Global.logger.log('NewtonAdapter', 'emailRecoverPassword', options);
                    }
                })
                .setEmail(options.email)
                .getEmailForgotFlow()
                .startForgotFlow();
            } else {
                reject('recoverPassword requires msisdn or email');
                Global.logger.error('NewtonAdapter', 'recoverPassword', 'recoverPassword requires msisdn or email');
            }
        });
    });
};