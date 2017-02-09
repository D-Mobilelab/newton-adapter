var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var calls, NewtonMock;

describe('INIT', function(){
    beforeEach(function(done){
        Mock.boostrap();
        calls = Mock.calls;
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;

        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('external login', function(done){
        var userId = '111222333444';
        var userProperties = {
            msisdn: '+39123456789'
        };
        var callbackMethod = function(){};
        NewtonAdapter.login({
            logged: true,
            userId: userId,
            userProperties: userProperties,
            callback: callbackMethod,
            type: 'external'
        }).then(function(){
            expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
            expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
            // expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalledWith(callbackMethod.call();
            expect(NewtonMock.setExternalID).toHaveBeenCalledWith(userId);
            expect(NewtonMock.getExternalLoginFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });        
    });

    it('custom login', function(done){
        var userId = '111222333444';
        var userProperties = {
            msisdn: '+39123456789'
        };
        var callbackMethod = function(){};
        NewtonAdapter.login({
            logged: true,
            userId: userId,
            userProperties: userProperties,
            callback: callbackMethod
        }).then(function(){
            expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
            expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
            // expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalledWith(callbackMethod.call();
            expect(NewtonMock.setCustomID).toHaveBeenCalledWith(userId);
            expect(NewtonMock.getCustomLoginFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});