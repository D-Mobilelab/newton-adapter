/* global Newton */
var Global = require('../global');

/**
* @ngdoc function
* @name finalizeLoginFlow
* @methodOf NewtonAdapter
*
* @description Execute callback when finalize login flow
* <br><b>Synchronous call, don't wait init</b>
*
* @param {function} callback method called when finalize login flow
*
* @return {boolean} return true if init has been called before, false if init has not been called before or callback is undefined
*
* @example
* <pre>
* NewtonAdapter.finalizeLoginFlow(function(){ console.log('ok'); });
* </pre>
*/

module.exports = function(callback){
    if(Global.newtonInstance && callback){
        Global.newtonInstance.finalizeLoginFlow(callback);
        return true;
    } else {
        return false;
    }
};