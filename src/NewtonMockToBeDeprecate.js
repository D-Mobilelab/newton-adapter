var calls = [], logged = false;
var NewtonMock = { 
    sendEvent: function(){ calls.push('sendEvent'); },
    timedEventStart: function(){ calls.push('timedEventStart'); },
    timedEventStop: function(){ calls.push('timedEventStop'); },
    isUserLogged: function(){ calls.push('isUserLogged'); return logged; },
    rankContent: function(){ calls.push('rankContent'); },
    getUserToken: function(){ calls.push('getUserToken'); },
    getSessionId: function(){ calls.push('getSessionId'); },
    setUserStateChangeListener: function(callback){ calls.push('setUserStateChangeListener'); callback.call(); },
    userLogout: function(){ calls.push('userLogout'); },
    finalizeLoginFlow: function(callback){ calls.push('finalizeLoginFlow'); callback.call(); },
    getLoginBuilder: function(){ calls.push('getLoginBuilder'); return this; },
    setCustomData: function(){ calls.push('setCustomData'); return this; },
    setLoginData: function(){ calls.push('setLoginData'); return this; },
    setOnFlowCompleteCallback: function(callback){ calls.push('setOnFlowCompleteCallback'); callback.call(); return this; },
    setCallback: function(callback){ calls.push('setCallback'); callback.call(); return this; },
    setExternalID: function(){ calls.push('setExternalID'); return this; },
    setCustomID: function(){ calls.push('setCustomID'); return this; },
    getExternalLoginFlow: function(){ calls.push('getExternalLoginFlow'); return this; },
    getCustomFlow: function(){ calls.push('getCustomFlow'); return this; },
    getCustomLoginFlow: function(){ calls.push('getCustomLoginFlow'); return this; },
    startLoginFlow: function(){ calls.push('startLoginFlow'); logged = true; return this; },
    setMSISDN: function(){ calls.push('setMSISDN'); return this; },
    setPIN: function(){ calls.push('setPIN'); return this; },
    getMSISDNPINLoginFlow: function(){ calls.push('getMSISDNPINLoginFlow'); return this; },
    __setDomain: function(){ calls.push('__setDomain'); return this; },
    getMSISDNURLoginFlow: function(){ calls.push('getMSISDNURLoginFlow'); return this; },
    setOAuthProvider: function(){ calls.push('setOAuthProvider'); return this; },
    setAccessToken: function(){ calls.push('setAccessToken'); return this; },
    setEmail: function(){ calls.push('setEmail'); return this; },
    setPassword: function(){ calls.push('setPassword'); return this; },
    setProductEmailParams: function(){ calls.push('setProductEmailParams'); return this; },
    setSMSTemplate: function(){ calls.push('setSMSTemplate'); return this; },
    getOAuthLoginFlow: function(){ calls.push('getOAuthLoginFlow'); return this; },
    getIdentityManager: function(){ calls.push('getIdentityManager'); return this; },
    getIdentities: function(){ return this; },
    getIdentityBuilder: function(){ calls.push('getIdentityBuilder'); return this; },
    getAddOAuthIdentityFlow: function(){ calls.push('getAddOAuthIdentityFlow'); return this; },
    getAddEmailIdentityFlow: function(){ calls.push('getAddEmailIdentityFlow'); return this; },
    getAddGenericIdentityFlow: function(){ calls.push('getAddGenericIdentityFlow'); return this; },
    startAddIdentityFlow: function(){ calls.push('startAddIdentityFlow'); return this; },
    setOnForgotFlowCallback: function(callback){ calls.push('setOnForgotFlowCallback'); callback.call(); return this; },
    getMSISDNPINForgotFlow: function(){ calls.push('getMSISDNPINForgotFlow'); return this; },
    startForgotFlow: function(){ calls.push('startForgotFlow'); return this; }
};

module.exports = {
    getSharedInstanceWithConfig: function(){ calls.push('getCustomFlow'); return NewtonMock; },
    getSharedInstance: function() { return NewtonMock; },
    SimpleObject: {
        fromJSONObject: function(obj){
            return obj;
        }
    },
    _reset: function() {
        calls = [];
        logged = false;
    },
    _getCalls: function(){
        return calls;
    }
};
