var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name asyncLogout
* @methodOf NewtonAdapter
*
* @description Performs logout from Newton, each server and client side.
* <br/><b>This method is executed after init</b>
*
* @return {Promise} promise will be resolved when logout is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.asyncLogout(function(resp){
*       if(resp){
*            // MANAGE ERROR
*        } else {
*            console.log('Logout with success');
*        }
*   })
* </pre>
*/

module.exports = function(callback){
    Bluebus.bind('init', function(){
        if(Global.newtonInstance.isUserLogged()){
            Global.newtonInstance.userLogoutAsync(function(resp){
                if(typeof callback === 'function'){
                    callback(resp);
                }

                Global.logger.log('NewtonAdapter', 'AsyncLogout', 'User logged out');
            });
        } else {
            Global.logger.warn('NewtonAdapter', 'AsyncLogout', 'User is already unlogged');
        }
    });
};