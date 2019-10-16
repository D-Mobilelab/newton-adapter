/* global Newton */
var Global = require('../global');
var syncUserState = require('./syncUserState');

/**
* @ngdoc function
* @name getTransientToken
* @methodOf NewtonAdapter
*
* @description Get Newton transient token for mobile fingerprint
* <br><b>Asynchronous call, require a callback</b>
*
* @param {Function} callback function invoked with error, resp
* @param {Object} options
* @param {Boolean} [options.syncUserState=false] Call syncUserState before retrieving the token
*
* @example
* <pre>
* NewtonAdapter.getTransientToken(function(err, resp){
*    console.log(err, resp);
* });
* </pre>
*/

module.exports = function(callback, options){
    options = options || { syncUserState: false };
    if(Global.newtonInstance && callback){
        if (options.syncUserState) {
            syncUserState(function(err) {
                if (!err) {
                    Global.newtonInstance.getTransientToken(callback);
                }
            });
        } else {
            Global.newtonInstance.getTransientToken(callback);
        }
    }
};
