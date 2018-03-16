var Promise = require('promise-polyfill');
var Global = require('../global');
var Utility = require('../utility');
/**
 * 
 * @param {Object} receipt 
 * @param {String} receipt.serializedPayment
 * @returns {Promise}
 */
function loginWithReceipt(receipt, customData) {
    return new Promise(function(resolve, reject) {
        Global.newtonInstance.getLoginBuilder()
        .setCustomData(Utility.createSimpleObject.fromJSONObject(customData))
        .setSerializedPayment(receipt.serializedPayment)
        .setOnFlowCompleteCallback(function(err) {
            if (!err) {
                resolve();
                return;
            }
            reject(err);
        })
        .getPaymentReceiptLoginFlow()
        .startLoginFlow();
    });

}

module.exports = loginWithReceipt;