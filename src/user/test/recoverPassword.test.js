var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var NewtonMock;

describe('user/recoverPassword', function(){
    var userId = '111222333444';
    var userProperties = {
        msisdn: '+39123456789'
    };
    var msisdn = '+39123456789';
    
    beforeEach(function(done){
        Mock.boostrap();        
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

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

    it('calls correctly Newton methods', function(done){
        NewtonAdapter.login({
            logged: true,
            type: 'external',
            userId: userId,
            userProperties: userProperties
        }).then(function(){
            NewtonAdapter.recoverPassword({
                msisdn: msisdn
            }).then(function(){
                expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();   
                expect(NewtonMock.setOnForgotFlowCallback).toHaveBeenCalled();   
                expect(NewtonMock.setMSISDN).toHaveBeenCalledWith(msisdn);   
                expect(NewtonMock.getMSISDNPINForgotFlow).toHaveBeenCalled();   
                expect(NewtonMock.startForgotFlow).toHaveBeenCalled();   
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        }).catch(function(reason){
            done.fail(reason);
        }); 
    });

});