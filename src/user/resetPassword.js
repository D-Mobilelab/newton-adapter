/* eslint-env browser */
/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name resetPassword
* @methodOf NewtonAdapter
*
* @description Reset password
*
* @param {Object} options configuration object
* @param {string} options.password new password
* @param {string} options.token access token
*
* @return {Promise} promise will be resolved when password is updated, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.resetPassword({
*       password: 'NEWPASSWORD',
*       token: '1234567890'
*   }).then(function(){
*       console.log('resetPassword success');
*   }).catch(function(err){
*       console.log('resetPassword failed', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('init', function(){
            if(options.token && !!options.password){
                Global.newtonInstance.resetPassword(options.token, options.password, function(err){
                    if(err){
                        reject(err);
                        Global.logger.error('NewtonAdapter', 'resetPassword', err);
                    } else {
                        resolve();
                        Global.logger.log('NewtonAdapter', 'resetPassword', options);
                    }
                });
            } else {
                Global.logger.error('NewtonAdapter', 'resetPassword', 'resetPassword requires password and token');
                reject('resetPassword requires password and token');
            }
        });
    });
};