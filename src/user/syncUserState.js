/* global Newton */
var Global = require('../global');

/**
 * @ngdoc function
 * @name syncUserState
 * @methodOf NewtonAdapter
 *
 * @description Refresh the current local user state asking to the server the real user state
 * <br><b>Asynchronous call, require a callback</b>
 *
 * @param {Function} callback The callback invoked when the state is refreshed
 *
 * @example
 * <pre>
 * NewtonAdapter.syncUserState(function(err){
 *    console.log(err);
 *    //... user state ensured
 * });
 * </pre>
 */

module.exports = function(callback) {
    if (Global.newtonInstance && callback) {
        Global.newtonInstance.syncUserState(callback);
    }
};
