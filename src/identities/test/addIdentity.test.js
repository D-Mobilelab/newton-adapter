var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var NewtonMock;

describe('identity/addIdentity', function(){
    beforeEach(function(done){
        Mock.boostrap();       
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;

        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            return NewtonAdapter.login({
                logged: true,
                type: 'custom',
                userId: 'userId',
                userProperties: { id: 'id' }
            });
        }).then(function(){
            done();
        }).catch(done.fail);
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

    it('type: oauth - call correct methods', function(done){
        var provider = 'Facebook';
        var accessToken = '1234567890abcedf';
        NewtonAdapter.addIdentity({
            type: 'oauth',
            provider: provider,
            access_token: accessToken
        }).then(function(){
            expect(NewtonMock.getIdentityManager).toHaveBeenCalled();
            expect(NewtonMock.getIdentityBuilder).toHaveBeenCalled();
            expect(NewtonMock.setOAuthProvider).toHaveBeenCalledWith(provider);
            expect(NewtonMock.setAccessToken).toHaveBeenCalledWith(accessToken);
            expect(NewtonMock.getAddOAuthIdentityFlow).toHaveBeenCalled();
            expect(NewtonMock.startAddIdentityFlow).toHaveBeenCalled();
            done();
        }).catch(done.fail);
    });

    it('type: email (without smsTemplate) - call correct methods', function(done){
        var email = 'foo@bar.com';
        var password = '1234567890abcedf';
        NewtonAdapter.addIdentity({
            type: 'email',
            email: email,
            password: password
        }).then(function(){
            expect(NewtonMock.getIdentityManager).toHaveBeenCalled();
            expect(NewtonMock.getIdentityBuilder).toHaveBeenCalled();
            expect(NewtonMock.setEmail).toHaveBeenCalledWith(email);
            expect(NewtonMock.setPassword).toHaveBeenCalledWith(password);
            expect(NewtonMock.setSMSTemplate).not.toHaveBeenCalled();
            expect(NewtonMock.getAddEmailIdentityFlow).toHaveBeenCalled();
            expect(NewtonMock.startAddIdentityFlow).toHaveBeenCalled();
            done();
        }).catch(done.fail);
    });

    it('type: email (with smsTemplate) - call correct methods', function(done){
        var email = 'foo@bar.com';
        var password = '1234567890abcedf';
        var smsTemplate = 'I am a sms template';
        NewtonAdapter.addIdentity({
            type: 'email',
            email: email,
            password: password,
            smsTemplate: smsTemplate
        }).then(function(){
            expect(NewtonMock.getIdentityManager).toHaveBeenCalled();
            expect(NewtonMock.getIdentityBuilder).toHaveBeenCalled();
            expect(NewtonMock.setEmail).toHaveBeenCalledWith(email);
            expect(NewtonMock.setPassword).toHaveBeenCalledWith(password);
            expect(NewtonMock.setSMSTemplate).toHaveBeenCalledWith(smsTemplate);
            expect(NewtonMock.getAddEmailIdentityFlow).toHaveBeenCalled();
            expect(NewtonMock.startAddIdentityFlow).toHaveBeenCalled();
            done();
        }).catch(done.fail);
    });

    it('type: generic - call correct methods', function(done){
        var smsTemplate = 'I am a sms template';
        NewtonAdapter.addIdentity({
            type: 'generic',
            smsTemplate: smsTemplate
        }).then(function(){
            expect(NewtonMock.getIdentityManager).toHaveBeenCalled();
            expect(NewtonMock.getIdentityBuilder).toHaveBeenCalled();
            expect(NewtonMock.setSMSTemplate).toHaveBeenCalledWith(smsTemplate);
            expect(NewtonMock.getAddGenericIdentityFlow).toHaveBeenCalled();
            expect(NewtonMock.startAddIdentityFlow).toHaveBeenCalled();
            done();
        }).catch(done.fail);
    });
});