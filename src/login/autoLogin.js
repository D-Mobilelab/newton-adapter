/* eslint-env browser */
var Global = require('../global');

/**
* @ngdoc function
* @name autoLogin
* @methodOf NewtonAdapter
*
* @description start autoLogin flow
*
* @param {Object} options configuration object
* @param {string} options.waitingUrl url for waiting page
* @param {string} options.subscribeUrl url for account page (redirect here if user isn't subscribed)
*
* @example
* <pre>
*   NewtonAdapter.autoLogin({
*     "waitingUrl":"http://www.domain.com/#!/waiting",
        "subscribeUrl":"http://www.domain.com/#!/settings"
*   });
* </pre>
*/
module.exports = function(options){
    var instance;
    if(options.waitingUrl){
        instance = Global.newtonInstance.getLoginBuilder();
        if(options.subscribeUrl) {
            instance.setSubscribeUrl(options.subscribeUrl);
        }
        instance.setWaitingUrl(options.waitingUrl)
        .getMSISDNURLoginFlow()
        .startLoginFlow();
    } else {
        Global.logger.error('NewtonAdapter', 'autoLogin', 'autoLogin requires waiting url');
    }
};