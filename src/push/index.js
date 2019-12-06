var Global = require('../global');

function registerDevice() {
    return new Promise(function(resolve, reject) {
        Global.newtonInstance.getPushManager().registerDevice(resolve, reject);
    });
}

function setPushCallback(callback) {
    Global.newtonInstance.getPushManager().setCallback(callback);
}

module.exports = {
    registerDevice: registerDevice,
    setPushCallback: setPushCallback
};
