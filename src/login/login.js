
var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');

/**
* @ngdoc function
* @name login
* @methodOf NewtonAdapter
*
* @description Performs Newton login
*
* @param {Object} options configuration object
* @param {boolean} [options.logged=false] new state of the user
* @param {string} [options.type="custom"]
 * (custom, external, msisdn, autologin, generic, oauth, receipt)
* @param {string} options.userId required for custom and external login
* @param {Object} [options.userProperties={}] available only for custom and external login
* @param {string} options.pin required for msisdn login
* @param {string} options.msisdn required for msisdn login
* @param {string} options.domain required for autologin login
* @param {string} options.provider required for oauth login
* @param {string} options.access_token required for oauth login
* @param {string} options.username required for generic login
* @param {string} options.email required for email login
* @param {string} options.password required for generic and email login
* @param {Object} options.receipt available only for receipt login
*
* @return {Promise} promise will be resolved when login is completed, rejected if failed
*
* @example
* <pre>
* // for logged users
*   NewtonAdapter.login({
*       logged: true,
*       type: 'external',
*       userId: '123456789',
*       userProperties: {
*           msisdn: '+39123456789',
*           type: 'freemium'
*       }
*   }).then(function(){
*       console.log('login success');
*   }).catch(function(err){
*       console.log('login failed', err);
*   });
*
*   const offerId = await NewtonAdapter.getOfferFor("nativeItemId", "googlePlay");
*   const receipt = await NativeNewton.buy(offerId, "nativeItemId")
*   NewtonAdapter.login({
*       type: 'receipt',
*       receipt: receipt
*   });
*
* // for unlogged users
* NewtonAdapter.login({
*       logged: false
* });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('init', function(){

            if(options.callback){
                Global.logger.warn('NewtonAdapter', 'Login', 'Callback method for login is not supported, use promise-then');
            }

            var callCallback = function(err){
                if(err){
                    reject(err);
                    Global.logger.error('NewtonAdapter', 'Login', err);
                } else {
                    resolve();
                    Global.logger.log('NewtonAdapter', 'Login', options);
                    Bluebus.trigger('login');
                }
            };

            if(!options.logged || Global.newtonInstance.isUserLogged()){
                callCallback();
            } else {
                var loginType = options.type ? options.type : 'custom';

                // newton version 1
                if(Global.newtonversion === 1){
                    if(loginType === 'custom'){
                        if(options.userId){
                            Global.newtonInstance.getLoginBuilder()
                            .setLoginData(Utility.createSimpleObject(options.userProperties))
                            .setCallback(callCallback)
                            .setCustomID(options.userId)
                            .getCustomFlow()
                            .startLoginFlow();
                        } else {
                            reject('Custom login requires userId');
                            Global.logger.error('NewtonAdapter', 'Login', 'Custom login requires userId');
                        }
                    } else {
                        reject('Newton v.1 not support this type of login');
                        Global.logger.error('NewtonAdapter', 'Login', 'Newton v.1 not support this type of login');
                    }

                // newton version 2
                } else {
                    if(loginType === 'custom'){
                        if(options.userId){
                            Global.newtonInstance.getLoginBuilder()
                            .setCustomData(Utility.createSimpleObject(options.userProperties))
                            .setOnFlowCompleteCallback(callCallback)
                            .setCustomID(options.userId)
                            .getCustomLoginFlow()
                            .startLoginFlow();
                        } else {
                            reject('Custom login requires userId');
                            Global.logger.error('NewtonAdapter', 'Login', 'Custom login requires userId');
                        }
                    } else if(loginType === 'external'){
                        if(options.userId){
                            Global.newtonInstance.getLoginBuilder()
                            .setCustomData(Utility.createSimpleObject(options.userProperties))
                            .setOnFlowCompleteCallback(callCallback)
                            .setExternalID(options.userId)
                            .getExternalLoginFlow()
                            .startLoginFlow();
                        } else {
                            reject('External login requires userId');
                            Global.logger.error('NewtonAdapter', 'Login', 'External login requires userId');
                        }
                    } else if(loginType === 'msisdn'){
                        if(options.msisdn){
                            var msisdnChain = Global.newtonInstance.getLoginBuilder()
                            .setOnFlowCompleteCallback(callCallback)
                            .setMSISDN(options.msisdn);
                            msisdnChain = options.pin
                                ? msisdnChain.setPIN(options.pin)
                                : msisdnChain.setNoPIN();
                            if(options.operator){
                                msisdnChain = msisdnChain.setOperator(options.operator);
                            }
                            msisdnChain.getMSISDNPINLoginFlow()
                            .startLoginFlow();
                        } else {
                            reject('Msisdn login requires at least msisdn');
                            Global.logger.error('NewtonAdapter', 'Login', 'Msisdn login requires at least msisdn');
                        }
                    } else if (loginType === 'alias') {
                        if (options.alias) {
                            var aliasChain = Global.newtonInstance.getLoginBuilder()
                                .setOnFlowCompleteCallback(callCallback)
                                .setAlias(options.alias);
                            aliasChain = options.pin
                                ? aliasChain.setPIN(options.pin)
                                : aliasChain.setNoPIN();
                            if (options.operator) {
                                aliasChain = aliasChain.setOperator(options.operator);
                            }
                            aliasChain.getMSISDNPINLoginFlow()
                                .startLoginFlow();
                        } else {
                            reject('Msisdn login requires at least msisdn');
                            Global.logger.error('NewtonAdapter', 'Login', 'Msisdn login requires at least msisdn');
                        }
                    } else if(loginType === 'email'){
                        if(options.email && options.password){
                            Global.newtonInstance.getLoginBuilder()
                            .setOnFlowCompleteCallback(callCallback)
                            .setEmail(options.email)
                            .setPassword(options.password)
                            .getEmailLoginFlow()
                            .startLoginFlow();
                        } else {
                            reject('Email login requires email and password');
                            Global.logger.error('NewtonAdapter', 'Login', 'Email login requires email and password');
                        }
                    } else if(loginType === 'generic'){
                        if(options.username && options.password){
                            Global.newtonInstance.getLoginBuilder()
                            .setOnFlowCompleteCallback(callCallback)
                            .setUsername(options.username)
                            .setPassword(options.password)
                            .getGenericLoginFlow()
                            .startLoginFlow();
                        } else {
                            reject('Generic login requires username and password');
                            Global.logger.error('NewtonAdapter', 'Login', 'Generic login requires username and password');
                        }
                    } else if(loginType === 'autologin'){
                        if(options.domain){
                            // eslint-disable-next-line no-underscore-dangle
                            Global.newtonInstance.getLoginBuilder()
                            .setOnFlowCompleteCallback(callCallback)
                            .__setDomain(options.domain)
                            .getMSISDNURLoginFlow()
                            .startLoginFlow();
                        } else {
                            reject('Autologin requires domain');
                            Global.logger.error('NewtonAdapter', 'Login', 'Autologin requires domain');
                        }
                    } else if(loginType === 'oauth'){
                        if(options.provider && options.access_token){
                            Global.newtonInstance.getLoginBuilder()
                            .setOAuthProvider(options.provider)
                            .setAccessToken(options.access_token)
                            .setOnFlowCompleteCallback(callCallback)
                            .getOAuthLoginFlow()
                            .startLoginFlow();
                        } else {
                            reject('OAuth login requires provider and access_token');
                            Global.logger.error('NewtonAdapter', 'Login', 'OAuth login requires provider and access_token');
                        }
                    } else if(loginType === 'receipt') {
                        if(options.receipt && options.receipt.serializedPayment){
                            Global.newtonInstance.getLoginBuilder()
                            .setCustomData(
                                Utility.createSimpleObject.fromJSONObject(options.userProperties)
                            )
                            .setSerializedPayment(options.receipt.serializedPayment)
                            .setOnFlowCompleteCallback(callCallback)
                            .getPaymentReceiptLoginFlow()
                            .startLoginFlow();
                        } else {
                            reject('Receipt login requires receipt');
                            Global.logger.error('NewtonAdapter', 'Login', 'Receipt login requires receipt');
                        }
                    } else {
                        reject('This type of login is unknown');
                        Global.logger.error('NewtonAdapter', 'Login', 'This type of login is unknown');
                    }
                }
            }
        });
    });
};