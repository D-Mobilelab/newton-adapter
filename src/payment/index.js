var Global = require('../global');
var Promisify = require('../promisify');

/**
 * Flow example
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


/**
 *
 * @param {String} nativeItemId
 * @param {String} store - googlePlay|appleStore
 * @returns {Promise}
 */
function getOfferFor(nativeItemId, store) {
    var getOfferForPromise = Promisify(Global.newtonInstance.getPaymentManager().getOfferFor);
    return getOfferForPromise(nativeItemId, store);
}

/**
 *
 * @param {String} serializedPayment
 * @returns {Promise}
 */
function addSerializedPayment(serializedPayment) {
    var addPaymentPromise = Promisify(
        Global.newtonInstance.getPaymentManager().addSerializedPayment
    );
    return addPaymentPromise(serializedPayment);
}

module.exports = {
    getOfferFor: getOfferFor,
    addSerializedPayment: addSerializedPayment
};
