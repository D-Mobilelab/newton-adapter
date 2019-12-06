var Global = require('../global');

/**
* @ngdoc function
* @name isUserLogged
* @methodOf NewtonAdapter
*
* @description Check if the user is already logged on Newton.
* <br><b>Synchronous call, don't wait init</b>
*
* @return {boolean} true if the user is already logged,
 * false if user is unlogged or init has not been called before
*
* @example
* <pre>
* NewtonAdapter.isUserLogged();
* </pre>
*/

module.exports = function(){
    if(Global.newtonInstance){
        return Global.newtonInstance.isUserLogged();
    } else {
        return false;
    }
};