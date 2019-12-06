
var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name logout
* @methodOf NewtonAdapter
*
* @description Performs logout from Newton.
* <br/><b>This will not slogging you on the server
 * (the token will remain active on server side, to logout the user also server side
 * please take a look to asyncLogout)</b>
* <br/><b>This method is executed after init</b>
*
* @return {Promise} promise will be resolved when logout is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.logout().then(function(wasLogged){
*       console.log('logout success', wasLogged);
*   })
* </pre>
*/

module.exports = function(){
    return new Promise(function(resolve){
        Bluebus.bind('init', function(){
            if(Global.newtonInstance.isUserLogged()){
                Global.newtonInstance.userLogout();
                resolve(true);
                Global.logger.log('NewtonAdapter', 'Logout');
            } else {
                resolve(false);
                Global.logger.warn('NewtonAdapter', 'Logout', 'User is already unlogged');
            }
        });
    });
};