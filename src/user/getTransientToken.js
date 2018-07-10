/* global Newton */
var Global = require('../global');

/**
* @ngdoc function
* @name getTransientToken
* @methodOf NewtonAdapter
*
* @description Get Newton transient token for mobile fingerprint
* <br><b>Asynchronous call, require a callback</b>
*
*
* @example
* <pre>
* NewtonAdapter.getTransientToken(function(err, resp){
*    console.log(err, resp);
* });
* </pre>
*/

module.exports = function(callback){
    if(Global.newtonInstance && callback){
        Global.newtonInstance.getTransientToken(callback);
    }
};