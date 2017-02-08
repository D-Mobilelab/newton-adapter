var NewtonAdapter = require('../../src/main');
var calls = require('./mock').calls;
var NewtonMock = require('./mock').NewtonMock;
Newton = require('./mock').Newton;

beforeEach(function(){
    spyOn(NewtonMock, 'sendEvent').and.callThrough();
    spyOn(NewtonMock, 'timedEventStart').and.callThrough();
    spyOn(NewtonMock, 'timedEventStop').and.callThrough();
    spyOn(NewtonMock, 'isUserLogged').and.callThrough();
    spyOn(NewtonMock, 'rankContent').and.callThrough();
    spyOn(NewtonMock, 'getUserToken').and.callThrough();
    spyOn(NewtonMock, 'setUserStateChangeListener').and.callThrough();
    // login
    spyOn(NewtonMock, 'getLoginBuilder').and.callThrough();
    spyOn(NewtonMock, 'setCustomData').and.callThrough();
    spyOn(NewtonMock, 'setLoginData').and.callThrough();
    spyOn(NewtonMock, 'setOnFlowCompleteCallback').and.callThrough();
    spyOn(NewtonMock, 'setCallback').and.callThrough();
    spyOn(NewtonMock, 'setExternalID').and.callThrough();
    spyOn(NewtonMock, 'setCustomID').and.callThrough();
    spyOn(NewtonMock, 'getExternalLoginFlow').and.callThrough();
    spyOn(NewtonMock, 'getCustomFlow').and.callThrough();
    spyOn(NewtonMock, 'getCustomLoginFlow').and.callThrough();
    spyOn(NewtonMock, 'startLoginFlow').and.callThrough();

    spyOn(Newton, 'getSharedInstanceWithConfig').and.callThrough();
});

describe('init -', function(){
    it('call Newton.getSharedInstanceWithConfig with secretId', function(done){
        var secretId = '<local_host>';
        NewtonAdapter.init({
            secretId: secretId,
            enable: true
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId, {});
            console.log('ok', done);
            done();                        
        }).catch(function(reason){
            console.log('ko', done);            
            done.fail(reason);
        });
    });
});