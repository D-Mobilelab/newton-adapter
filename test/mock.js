var Mock = {
    calls: [],
    NewtonMock: {},
    Newton: {},
    logged: false,

    boostrap: function(){
        Mock.logged = false;
        Mock.calls = [];
        Mock.NewtonMock = {
            sendEvent: function(){ Mock.calls.push('sendEvent'); },
            timedEventStart: function(){ Mock.calls.push('timedEventStart'); },
            timedEventStop: function(){ Mock.calls.push('timedEventStop'); },
            isUserLogged: function(){ Mock.calls.push('isUserLogged'); return Mock.logged; },
            rankContent: function(){ Mock.calls.push('rankContent'); },
            getUserToken: function(){ Mock.calls.push('getUserToken'); },
            setUserStateChangeListener: function(callback){ Mock.calls.push('setUserStateChangeListener'); callback.call(); },
            userLogout: function(){ Mock.calls.push('userLogout'); },
            finalizeLoginFlow: function(callback){ Mock.calls.push('finalizeLoginFlow'); callback.call(); },
            // login methods
            getLoginBuilder: function(){ Mock.calls.push('getLoginBuilder'); return this; },
            setCustomData: function(){ Mock.calls.push('setCustomData'); return this; },
            setLoginData: function(){ Mock.calls.push('setLoginData'); return this; },
            setOnFlowCompleteCallback: function(callback){ Mock.calls.push('setOnFlowCompleteCallback'); callback.call(); return this; },
            setCallback: function(callback){ Mock.calls.push('setCallback'); callback.call(); return this; },
            setExternalID: function(){ Mock.calls.push('setExternalID'); return this; },
            setCustomID: function(){ Mock.calls.push('setCustomID'); return this; },
            getExternalLoginFlow: function(){ Mock.calls.push('getExternalLoginFlow'); return this; },
            getCustomFlow: function(){ Mock.calls.push('getCustomFlow'); return this; },
            getCustomLoginFlow: function(){ Mock.calls.push('getCustomLoginFlow'); return this; },
            startLoginFlow: function(){ Mock.calls.push('startLoginFlow'); Mock.logged = true; return this; },
            setMSISDN: function(){ Mock.calls.push('setMSISDN'); return this; },
            setPIN: function(){ Mock.calls.push('setPIN'); return this; },
            getMSISDNPINLoginFlow: function(){ Mock.calls.push('getMSISDNPINLoginFlow'); return this; },
            __setDomain: function(){ Mock.calls.push('__setDomain'); return this; },
            getMSISDNURLoginFlow: function(){ Mock.calls.push('getMSISDNURLoginFlow'); return this; },
            setOAuthProvider: function(){ Mock.calls.push('setOAuthProvider'); return this; },
            setAccessToken: function(){ Mock.calls.push('setAccessToken'); return this; },
            setEmail: function(){ Mock.calls.push('setEmail'); return this; },
            setPassword: function(){ Mock.calls.push('setPassword'); return this; },
            setProductEmailParams: function(){ Mock.calls.push('setProductEmailParams'); return this; },
            setSMSTemplate: function(){ Mock.calls.push('setSMSTemplate'); return this; },
            getOAuthLoginFlow: function(){ Mock.calls.push('getOAuthLoginFlow'); return this; },
            getIdentityManager: function(){ Mock.calls.push('getIdentityManager'); return this; },
            getIdentityBuilder: function(){ Mock.calls.push('getIdentityBuilder'); return this; },
            getAddOAuthIdentityFlow: function(){ Mock.calls.push('getAddOAuthIdentityFlow'); return this; },
            getAddEmailIdentityFlow: function(){ Mock.calls.push('getAddEmailIdentityFlow'); return this; },
            getAddGenericIdentityFlow: function(){ Mock.calls.push('getAddGenericIdentityFlow'); return this; },
            startAddIdentityFlow: function(){ Mock.calls.push('startAddIdentityFlow'); return this; },
            setOnForgotFlowCallback: function(callback){ Mock.calls.push('setOnForgotFlowCallback'); callback.call(); return this; },
            getMSISDNPINForgotFlow: function(){ Mock.calls.push('getMSISDNPINForgotFlow'); return this; },
            startForgotFlow: function(){ Mock.calls.push('startForgotFlow'); return this; }
        };
        Mock.Newton = {
            getSharedInstanceWithConfig: function(){ Mock.calls.push('getCustomFlow'); return Mock.NewtonMock; },
            getSharedInstance: function() { return Mock.NewtonMock; },
            SimpleObject: {
                fromJSONObject: function(obj){
                    return obj;
                }
            }
        };

        spyOn(Mock.NewtonMock, 'sendEvent').and.callThrough();
        spyOn(Mock.NewtonMock, 'timedEventStart').and.callThrough();
        spyOn(Mock.NewtonMock, 'timedEventStop').and.callThrough();
        spyOn(Mock.NewtonMock, 'isUserLogged').and.callThrough();
        spyOn(Mock.NewtonMock, 'rankContent').and.callThrough();
        spyOn(Mock.NewtonMock, 'getUserToken').and.callThrough();
        spyOn(Mock.NewtonMock, 'setUserStateChangeListener').and.callThrough();
        spyOn(Mock.NewtonMock, 'userLogout').and.callThrough();
        spyOn(Mock.NewtonMock, 'finalizeLoginFlow').and.callThrough();
        // login methods
        spyOn(Mock.NewtonMock, 'getLoginBuilder').and.callThrough();
        spyOn(Mock.NewtonMock, 'setCustomData').and.callThrough();
        spyOn(Mock.NewtonMock, 'setLoginData').and.callThrough();
        spyOn(Mock.NewtonMock, 'setOnFlowCompleteCallback').and.callThrough();
        spyOn(Mock.NewtonMock, 'setCallback').and.callThrough();
        spyOn(Mock.NewtonMock, 'setExternalID').and.callThrough();
        spyOn(Mock.NewtonMock, 'setCustomID').and.callThrough();
        spyOn(Mock.NewtonMock, 'getExternalLoginFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'getCustomFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'getCustomLoginFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'startLoginFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'setMSISDN').and.callThrough();
        spyOn(Mock.NewtonMock, 'setPIN').and.callThrough();
        spyOn(Mock.NewtonMock, 'getMSISDNPINLoginFlow').and.callThrough();
        spyOn(Mock.NewtonMock, '__setDomain').and.callThrough();
        spyOn(Mock.NewtonMock, 'getMSISDNURLoginFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'setOAuthProvider').and.callThrough();
        spyOn(Mock.NewtonMock, 'setAccessToken').and.callThrough();
        spyOn(Mock.NewtonMock, 'setEmail').and.callThrough();
        spyOn(Mock.NewtonMock, 'setPassword').and.callThrough();
        spyOn(Mock.NewtonMock, 'setProductEmailParams').and.callThrough();
        spyOn(Mock.NewtonMock, 'setSMSTemplate').and.callThrough();
        spyOn(Mock.NewtonMock, 'getOAuthLoginFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'getIdentityManager').and.callThrough();
        spyOn(Mock.NewtonMock, 'getIdentityBuilder').and.callThrough();
        spyOn(Mock.NewtonMock, 'getAddOAuthIdentityFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'getAddEmailIdentityFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'getAddGenericIdentityFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'startAddIdentityFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'setOnForgotFlowCallback').and.callThrough();
        spyOn(Mock.NewtonMock, 'getMSISDNPINForgotFlow').and.callThrough();
        spyOn(Mock.NewtonMock, 'startForgotFlow').and.callThrough();
        
        spyOn(Mock.Newton, 'getSharedInstanceWithConfig').and.callThrough();
    }
};
module.exports = Mock;