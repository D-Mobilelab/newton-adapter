/* eslint-env browser */
/* global Newton */
var Promise = require('promise-polyfill');
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
module.exports = function(deps){
    return function(options){
        return new Promise(function(resolve, reject){
            deps.Bluebus.bind('login', function(){
                if(options.type){
                    deps.Global.newtonInstance.getIdentityManager().getIdentities(function(identError, identities){
                        if(identError){
                            reject(identError);
                            deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'getIdentities failed', identError);
                        } else {
                            deps.Global.logger.log('NewtonAdapter', 'removeIdentity', 'getIdentities success', options, identities);
                            if(identities.length < 2){
                                reject('it\'s not possible remove unique identity');
                                deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'it\'s not possible remove unique identity');
                            } else {
                                for(var i = 0; i < identities.length; i++) {
                                    if (options.type === identities[i].getType()){
                                        identities[i].delete(function(deleteError){
                                            if(deleteError){
                                                reject(deleteError);
                                                deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'delete failed', deleteError);
                                            } else {
                                                resolve(true);
                                                deps.Global.logger.log('NewtonAdapter', 'removeIdentity', 'delete success');
                                            }
                                        });
                                        break;
                                    }
                                }
                                /** If we're here there was no match */
                                var err = new Error('no identities for ' + options.type);
                                err.code = 404;
                                err.name = 'NotFound';
                                reject(err);
                            }
                        }
                    });
                } else if(options.identity) {
                    options.identity.delete(function(deleteError){
                        if(deleteError) {
                            reject(deleteError);
                            deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'delete failed', deleteError);
                        } else {
                            resolve(true);
                            deps.Global.logger.log('NewtonAdapter', 'removeIdentity', 'delete success');
                        }
                    });
                } else {
                    reject('removeIdentity requires type or identity object');
                    deps.Global.logger.error('NewtonAdapter', 'removeIdentity', 'removeIdentity requires type or identity object');
                }
            });
        });
    };
};