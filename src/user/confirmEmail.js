/* eslint-env browser */

var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name confirmEmail
* @methodOf NewtonAdapter
*
* @description Confirm email identity without logging user
*
* @param {Object} options configuration object
* @param {string} [options.token] token to confirm email
*
* @return {Promise} promise that will be resolved
 * when the confirmEmail has been completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.confirmEmail({
*       token: 'nets:ff6ad467df62a58324b9:ifortune'
*   }).then(function(){
*       console.log('confirmEmail success');
*   }).catch(function(err){
*       console.log('confirmEmail failed', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('init', function(){
            Global.newtonInstance.confirmEmail(options.token, function(err) {
                if(err){
                    reject(err);
                    Global.logger.error('NewtonAdapter', 'confirmEmail', err);
                } else {
                    resolve();
                    Global.logger.log('NewtonAdapter', 'confirmEmail', options);
                }
            });
        });
    });
};