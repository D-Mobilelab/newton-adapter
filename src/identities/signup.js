/* global Newton */

var Global = require('../global');
var Utility = require('../utility');

/**
* @ngdoc function
* @name signup
* @methodOf NewtonAdapter
*
* @description Register a non logged user<br>
* <b>This method is executed when user is unlogged and not recognized by Newton.</b>
*
* @param {Object} options configuration object
* @param {string} options.email email of identity to add (email)
* @param {string} options.password password of identity to add (email)
* @param {Object} [options.userProperties={}] user props to store for that identity (email)
* @param {Object} [options.customData={}] custom data for newton tracking event (custom event)
*
* @return {Promise} promise will be resolved when signup is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.signup({
*       email: 'mail@mail.com',
*       password: 'mailpwd',
*       userProperties: {},
*       customData: {}
*   }).then(function(){
*       console.log('signup success');
*   }).catch(function(err){
*       console.log('signup failed', err);
*   });
* </pre>
*/

module.exports = function (options) {
    return new Promise(function (resolve, reject) {
        var callback = function (errLocal, optionsLocal) {
            if (errLocal) {
                reject(errLocal);
                Global.logger.error('NewtonAdapter', 'signup', errLocal);
            } else {
                resolve();
                Global.logger.log('NewtonAdapter', 'signup', optionsLocal);
            }
        };

        if(options.email && options.password){
            var signupChain = Newton.getSharedInstance().getLoginBuilder()
                .setOnFlowCompleteCallback(function (err) { callback(err, options); })
                .setEmail(options.email)
                .setPassword(options.password);

            if (typeof options.customData !== 'undefined') {
                signupChain = signupChain.setCustomData(
                    Utility.createSimpleObject(options.customData)
                ); // THIS SHOULD BE A SIMPLE OBJECT
            }

            if (typeof options.userProperties !== 'undefined') {
                signupChain = signupChain.setUserProperties(
                    Utility.createSimpleObject(options.userProperties)
                ); // THIS SHOULD BE A SIMPLE OBJECT
            }

            signupChain.getEmailSignupFlow().startLoginFlow();
        } else {
            reject('Can not start signup flow');
            Global.logger.error('NewtonAdapter', 'signup', 'Signup is not supported with those arguments.', options);
        }
    });
};