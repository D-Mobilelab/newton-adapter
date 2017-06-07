/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');
var Utility = require('../utility');

/**
* @ngdoc function
* @name addIdentity
* @methodOf NewtonAdapter
*
* @description Add identity to an user<br>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
*
* @param {Object} options configuration object
* @param {string} [options.type='oauth'] type of identity to add (oauth, email, generic)
* @param {string} options.provider provider of identity to add (oauth)
* @param {string} options.access_token access token of identity to add (oauth)
* @param {string} options.email email of identity to add (email)
* @param {string} options.password password of identity to add (email)
* @param {Object} [options.params={}] params of identity to add (email)
* @param {string} options.smsTemplate SMS template of identity to add (generic)
*
* @return {Promise} ppromise will be resolved when adding is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.addIdentity({
*       type: 'oauth',
*       provider: 'Facebook',
*       access_token: '1234567890'
*   }).then(function(){
*       console.log('addIdentity success');
*   }).catch(function(err){
*       console.log('addIdentity failed', err);
*   });
* </pre>
*/

module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            var identityType = options.type ? options.type : 'oauth';
            if(identityType === 'oauth'){
                if(options.provider && options.access_token){
                    Global.newtonInstance.getIdentityManager()
                    .getIdentityBuilder()
                    .setOAuthProvider(options.provider)
                    .setAccessToken(options.access_token)
                    .setOnFlowCompleteCallback(function(err){
                        if(err){
                            reject(err);
                            Global.logger.error('NewtonAdapter', 'addIdentity', 'Oauth', err);
                        } else {
                            resolve();
                            Global.logger.log('NewtonAdapter', 'addIdentity', 'Oauth', options);
                        }
                    })
                    .getAddOAuthIdentityFlow()
                    .startAddIdentityFlow();
                } else {
                    reject('addIdentity outh requires provider and access_token');
                    Global.logger.error('NewtonAdapter', 'addIdentity', 'Oauth', 'addIdentity oauth requires provider and access_token');
                }
            } else if(identityType === 'email'){
                if(options.email && options.password){
                    Global.newtonInstance.getIdentityManager()
                    .getIdentityBuilder()
                    .setEmail(options.email)
                    .setPassword(options.password)
                    .setProductEmailParams(Utility.createSimpleObject(options.params))
                    .setOnFlowCompleteCallback(function(err){
                        if(err){
                            reject(err);
                            Global.logger.error('NewtonAdapter', 'addIdentity', 'Email', err);
                        } else {
                            resolve();
                            Global.logger.log('NewtonAdapter', 'addIdentity', 'Email', options);
                        }
                    })
                    .getAddEmailIdentityFlow()
                    .startAddIdentityFlow();
                } else {
                    reject('addIdentity email, requires email and password');
                    Global.logger.error('NewtonAdapter', 'addIdentity', 'Email', 'addIdentity email requires email and password');
                }
            } else if(identityType === 'generic'){
                if(options.smsTemplate){
                    Global.newtonInstance.getIdentityManager()
                    .getIdentityBuilder()
                    .setOnFlowCompleteCallback(function(err){
                        if(err){
                            reject(err);
                            Global.logger.error('NewtonAdapter', 'addIdentity', 'Generic', err);
                        } else {
                            resolve();
                            Global.logger.log('NewtonAdapter', 'addIdentity', 'Generic', options);
                        }
                    })
                    .setSMSTemplate(options.smsTemplate)
                    .getAddGenericIdentityFlow()
                    .startAddIdentityFlow();
                } else {
                    reject('addIdentity generic, requires smsTemplate');
                    Global.logger.error('NewtonAdapter', 'addIdentity', 'Generic', 'addIdentity generic requires smsTemplate');
                }
            } else {
                reject('This type of add identity is not supported');
                Global.logger.error('NewtonAdapter', 'addIdentity', 'This type of add identity is not supported');
            }
        });
    });
};