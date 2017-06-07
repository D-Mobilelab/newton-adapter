/* eslint-env browser */
/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name removeIdentity
* @methodOf NewtonAdapter
*
* @description Remove identity from an user<br>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
*
* @param {Object} options configuration object
* @param {string} options.type type of identity to remove
* @param {string} options.identity identity instance to remove
*
* @return {Promise} promise will be resolved when removing is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.removeIdentity({
*       type: 'oauth'
*   }).then(function(){
*       console.log('removeIdentity success');
*   }).catch(function(err){
*       console.log('removeIdentity failed', err);
*   });
* </pre>
*/
module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            if(options.type){
                Global.newtonInstance.getIdentityManager().getIdentities(function(identError, identities){
                    if(identError){
                        reject(identError);
                        Global.logger.error('NewtonAdapter', 'removeIdentity', 'getIdentities failed', identError);
                    } else {
                        Global.logger.log('NewtonAdapter', 'removeIdentity', 'getIdentities success', options, identities);
                        if(identities.length < 2){
                            reject('it\'s not possible remove unique identity');
                            Global.logger.error('NewtonAdapter', 'removeIdentity', 'it\'s not possible remove unique identity');
                        } else {
                            for(var i = 0, goFoward = true; i < identities.length && goFoward; i++){
                                if (options.type === identities[i].getType()){
                                    goFoward = false;
                                    identities[i].delete(function(deleteError){
                                        if(deleteError){
                                            reject(deleteError);
                                            Global.logger.error('NewtonAdapter', 'removeIdentity', 'delete failed', deleteError);
                                        } else {
                                            resolve();
                                            Global.logger.log('NewtonAdapter', 'removeIdentity', 'delete success');
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            } else if(options.identity) {
                options.identity.delete(function(deleteError){
                    if(deleteError){
                        reject(deleteError);
                        Global.logger.error('NewtonAdapter', 'removeIdentity', 'delete failed', deleteError);
                    } else {
                        resolve();
                        Global.logger.log('NewtonAdapter', 'removeIdentity', 'delete success');
                    }
                });
            } else {
                reject('removeIdentity requires type or identity object');
                Global.logger.error('NewtonAdapter', 'removeIdentity', 'removeIdentity requires type or identity object');
            }
        });
    });
};