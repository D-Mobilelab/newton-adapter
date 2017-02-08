var loggedFlag = false;

module.exports = {
    calls:[],
    getSharedInstanceWithConfig: function(){ this.calls.push('getCustomFlow'); return this; },
    getSharedInstance: function() { return this; },
    SimpleObject: {
        fromJSONObject: function(obj){
            return obj;
        }
    },
    sendEvent: function(){ this.calls.push('sendEvent'); },
    timedEventStart: function(){ this.calls.push('timedEventStart'); },
    timedEventStop: function(){ this.calls.push('timedEventStop'); },
    isUserLogged: function(){ this.calls.push('isUserLogged');},
    rankContent: function(){ this.calls.push('rankContent'); },
    getUserToken: function(){ this.calls.push('getUserToken'); },
    setUserStateChangeListener: function(callback){ this.calls.push('setUserStateChangeListener'); callback.call(); },
    // login
    getLoginBuilder: function(){ this.calls.push('getLoginBuilder'); return this; },
    setCustomData: function(){ this.calls.push('setCustomData'); return this; },
    setLoginData: function(){ this.calls.push('setLoginData'); return this; },
    setOnFlowCompleteCallback: function(){ this.calls.push('setOnFlowCompleteCallback'); return this; },
    setCallback: function(){ this.calls.push('setCallback'); return this; },
    setExternalID: function(){ this.calls.push('setExternalID'); return this; },
    setCustomID: function(){ this.calls.push('setCustomID'); return this; },
    getExternalLoginFlow: function(){ this.calls.push('getExternalLoginFlow'); return this; },
    getCustomFlow: function(){ this.calls.push('getCustomFlow'); return this; },
    getCustomLoginFlow: function(){ this.calls.push('getCustomLoginFlow'); return this; },
    startLoginFlow: function(){ this.calls.push('startLoginFlow'); return this; },
    resetCalls: function(){ this.calls = [];}
};