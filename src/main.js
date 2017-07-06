/* eslint-env browser */
/* global Newton */
var Bluebus = require('bluebus');
var Global = require('./global');

/**
* @ngdoc object
* @name NewtonAdapter
*
* @description
* Adapter for Newton sdk to be used in B! web applications
*/
module.exports = new function(){

    // USE ONLY FOR TEST!
    /**
     * TODO: if(process.env.NODE_ENV === 'test') {
     *  
     * }
     */
    this.resetForTest = function(){
        Global.cleanAll();
        Bluebus.cleanAll();
    };

    this.startHeartbeat = require('./heartbeat/startHeartbeat');
    this.stopHeartbeat = require('./heartbeat/stopHeartbeat');

    this.getIdentities = require('./identities/getIdentities');   
    this.getIdentity = require('./identities/getIdentity');   
    this.addIdentity = require('./identities/addIdentity');   
    this.removeIdentity = require('./identities/removeIdentity')({ Bluebus: Bluebus, Global: Global });

    this.init = require('./initialization/init');
    this.isInitialized = require('./initialization/isInitialized');

    this.autoLogin = require('./login/autoLogin');
    this.finalizeLoginFlow = require('./login/finalizeLoginFlow');
    this.isUserLogged = require('./login/isUserLogged');
    this.login = require('./login/login');
    this.logout = require('./login/logout');
    this.setUserStateChangeListener = require('./login/setUserStateChangeListener');

    this.rankContent = require('./tracking/rankContent');
    this.trackEvent = require('./tracking/trackEvent');
    this.trackPageview = require('./tracking/trackPageview');

    this.confirmEmail = require('./user/confirmEmail');
    this.confirmEmailAndLogin = require('./user/confirmEmailAndLogin');
    this.getUserToken = require('./user/getUserToken');
    this.recoverPassword = require('./user/recoverPassword');
    this.resetPassword = require('./user/resetPassword');
    this.userDelete = require('./user/userDelete');    
};
