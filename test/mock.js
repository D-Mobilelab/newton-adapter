var Mock = {
    calls: [],
    NewtonMock: {},
    Newton: {},

    boostrap: function(){
        Mock.calls = [];
        Mock.NewtonMock = {
            sendEvent: function(){ Mock.calls.push('sendEvent'); },
            timedEventStart: function(){ Mock.calls.push('timedEventStart'); },
            timedEventStop: function(){ Mock.calls.push('timedEventStop'); },
            isUserLogged: function(){ Mock.calls.push('isUserLogged'); },
            rankContent: function(){ Mock.calls.push('rankContent'); },
            getUserToken: function(){ Mock.calls.push('getUserToken'); },
            setUserStateChangeListener: function(callback){ Mock.calls.push('setUserStateChangeListener'); callback.call(); },
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
            startLoginFlow: function(){ Mock.calls.push('startLoginFlow'); return this; }
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
        spyOn(Mock.Newton, 'getSharedInstanceWithConfig').and.callThrough();
    }
};
module.exports = Mock;