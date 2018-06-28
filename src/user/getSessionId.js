/* global Newton */
var Global = require('../global');

/**
* @ngdoc function
* @name getSessionId
* @methodOf NewtonAdapter
*
* @description Get Newton session Id
*
* @return {string} Newton session id or false
*
* @example
* <pre>
* NewtonAdapter.getSessionId();
* </pre>
*/

module.exports = function(){
    if(Global.newtonInstance){
        return Global.newtonInstance.getSessionId();
    } else {
        return false;
    }
};