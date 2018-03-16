/* global Newton */
var Global = require('../global');

/**
* @ngdoc function
* @name setUserStateChangeListener
* @methodOf NewtonAdapter
*
* @description Execute callback when user state change
* <br><b>Synchronous call, don't wait init</b>
*
* @param {function} callback method called when user state changes
*
* @return {boolean} return true if init has been called before, false if init has not been called before or callback is undefined
*
* @example
* <pre>
* NewtonAdapter.setUserStateChangeListener(function(state){ console.log(state); });
* </pre>
*/
module.exports = function(callback){
    if(Global.newtonInstance && callback){
        Global.newtonInstance.setUserStateChangeListener({
            onLoginStateChange: callback
        });        
        return true;
    } else {
        return false;
    }
};