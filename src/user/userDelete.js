/* eslint-env browser */

var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name userDelete
* @methodOf NewtonAdapter
*
* @description Delete an user<br>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
*
* @return {Promise} ppromise will be resolved when deleting is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.userDelete().then(function(){
*       console.log('userDelete success');
*   }).catch(function(err){
*       console.log('userDelete failed', err);
*   });
* </pre>
*/

module.exports = function(){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            Global.newtonInstance.getIdentityManager()
                .getIdentities(function(identError, identities){
                    if(identError){
                        reject(identError);
                        Global.logger.error('NewtonAdapter', 'userDelete', 'getIdentities failed', identError);
                    } else {
                        Global.logger.log('NewtonAdapter', 'userDelete', 'getIdentities success', identities);
                        for(var i = 0, goFoward = true; i < identities.length && goFoward; i++){
                            if (identities[i].getType() === 'msisdn'){
                                goFoward = false;
                                reject('Error on userDelete: please use unsubscribe instead');
                                Global.logger.error('NewtonAdapter', 'userDelete', 'Error on userDelete: please use unsubscribe instead');
                            }
                        }
                        Global.newtonInstance.getIdentityManager().userDelete(function(deleteError){
                            if(deleteError){
                                reject(deleteError);
                                Global.logger.error('NewtonAdapter', 'userDelete', 'delete', deleteError);
                            } else {
                                resolve();
                                Global.logger.log('NewtonAdapter', 'userDelete', identities);
                            }
                        });
                    }
                });
        });
    });
};