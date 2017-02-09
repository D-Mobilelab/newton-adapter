var Mock = {
    calls: [],
    NewtonMock: {
        sendEvent: function(){ Mock.calls.push('sendEvent'); },
        timedEventStart: function(){ Mock.calls.push('timedEventStart'); },
        timedEventStop: function(){ Mock.calls.push('timedEventStop'); },
        isUserLogged: function(){ Mock.calls.push('isUserLogged'); },
        rankContent: function(){ Mock.calls.push('rankContent'); },
        getUserToken: function(){ Mock.calls.push('getUserToken'); },
        setUserStateChangeListener: function(callback){ Mock.calls.push('setUserStateChangeListener'); callback.call(); },
        // login
        getLoginBuilder: function(){ Mock.calls.push('getLoginBuilder'); return this; },
        setCustomData: function(){ Mock.calls.push('setCustomData'); return this; },
        setLoginData: function(){ Mock.calls.push('setLoginData'); return this; },
        setOnFlowCompleteCallback: function(){ Mock.calls.push('setOnFlowCompleteCallback'); return this; },
        setCallback: function(){ Mock.calls.push('setCallback'); return this; },
        setExternalID: function(){ Mock.calls.push('setExternalID'); return this; },
        setCustomID: function(){ Mock.calls.push('setCustomID'); return this; },
        getExternalLoginFlow: function(){ Mock.calls.push('getExternalLoginFlow'); return this; },
        getCustomFlow: function(){ Mock.calls.push('getCustomFlow'); return this; },
        getCustomLoginFlow: function(){ Mock.calls.push('getCustomLoginFlow'); return this; },
        startLoginFlow: function(){ Mock.calls.push('startLoginFlow'); return this; }
    },

    Newton: {
        getSharedInstanceWithConfig: function(){ Mock.calls.push('getCustomFlow'); return Mock.NewtonMock; },
        getSharedInstance: function() { return Mock.NewtonMock; },
        SimpleObject: {
            fromJSONObject: function(obj){
                return obj;
            }
        }
    }
};
module.exports = Mock;