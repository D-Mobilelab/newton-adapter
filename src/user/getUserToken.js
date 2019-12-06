var Global = require('../global');

/**
* @ngdoc function
* @name getUserToken
* @methodOf NewtonAdapter
*
* @description Get Newton user token
* <br><b>Synchronous call, don't wait init</b>
*
* @return {string} Newton user token or false if init has not been called before
*
* @example
* <pre>
* NewtonAdapter.getUserToken();
* </pre>
*/

module.exports = function(){
    if(Global.newtonInstance){
        return Global.newtonInstance.getUserToken();
    } else {
        return false;
    }
};