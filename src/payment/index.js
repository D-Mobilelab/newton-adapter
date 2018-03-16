var Promise = require('promise-polyfill');
var Global = require('../global');

function getOfferFor(nativeItemId, store) {
    return new Promise(function(resolve, reject) {
        Global.newtonInstance.getPaymentManager()
        .getOfferFor(nativeItemId, store, function(err, offerId) {
            if(err) return reject(err);
            return resolve(offerId);
        });
    });
}


function addPayment(serializedPayment) {
    return new Promise(function(resolve, reject) {
        Global.newtonInstance.getPaymentManager()
        .addSerializedPayment(serializedPayment, function(err, response) {
            if(err) return reject(err);
            return resolve(response);
        });
    });
}

module.exports = {
    getOfferFor: getOfferFor,
    addPayment: addPayment
};
/** 
 * if (user.logged) {
 *  getOfferFor(nativeItemId, store)  
 *   .then(function(offer_id) {
 *       return NativeNewton.buy(offer_id, nativeItemId) 
 *   })
 *  .then(function(receipt){
 *      // NativeStorage.setItem('receipt', receipt) save it
 *      return addPayment(receipt.serializedPayment);
 *  })
 *  .catch(function(){
 *      // handle item already owned etc 
 *      
 *  }) 
 * }
 
*/