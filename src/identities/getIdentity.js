/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name getIdentities
* @methodOf NewtonAdapter
*
* @description Get identities from current user<br/>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
*
* @return {string} promise that will be resolved when the identities has been retrieved for the current user, rejected if failed
*
* @example
* <pre>
* NewtonAdapter.getIdentities();
* </pre>
*/

module.exports = function(identityType){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            Global.newtonInstance.getIdentityManager().getIdentities(function(err, identities){
                if(err){
                    reject(err);
                    Global.logger.error('NewtonAdapter', 'getIdentities', err);
                } else {
                    var singleIdentity = false;

                    for(var index in identities){
                        if(identities[index] && identities[index].getType === identityType){
                            singleIdentity = identities[index];
                        }
                    }
                    
                    resolve(singleIdentity);
                    Global.logger.log('NewtonAdapter', 'getIdentities', identities);
                }
            });
        });
    });
};