/* eslint-env browser */
/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('./global');

/**
* @ngdoc object
* @name NewtonAdapter
*
* @description
* Adapter for Newton sdk to be used in B! web applications
*/
var NewtonAdapter = new function(){

    // USE ONLY FOR TEST!
    this.resetForTest = function(){
        Global.cleanAll();
        Bluebus.cleanAll();
    };

    this.init = require('./initialization/init');
    this.isInitialized = require('./initialization/isInitialized');

    this.rankContent = require('./tracking/rankContent');
    this.trackEvent = require('./tracking/trackEvent');
    this.trackPageview = require('./tracking/trackPageview');

    this.startHeartbeat = require('./heartbeat/startHeartbeat');
    this.stopHeartbeat = require('./heartbeat/stopHeartbeat');

    this.autoLogin = require('./user/autoLogin');
    this.confirmEmail = require('./user/confirmEmail');
    this.confirmEmailAndLogin = require('./user/confirmEmailAndLogin');
    this.finalizeLoginFlow = require('./user/finalizeLoginFlow');
    this.getUserToken = require('./user/getUserToken');
    this.isUserLogged = require('./user/isUserLogged');
    this.login = require('./user/login');
    this.logout = require('./user/logout');
    this.recoverPassword = require('./user/recoverPassword');
    this.resetPassword = require('./user/resetPassword');
    this.setUserStateChangeListener = require('./user/setUserStateChangeListener');
    this.userDelete = require('./user/userDelete');

    this.getIdentities = require('./identities/getIdentities');   
    this.addIdentity = require('./identities/addIdentity');   
    this.removeIdentity = require('./identities/removeIdentity');
};

module.exports = NewtonAdapter;
