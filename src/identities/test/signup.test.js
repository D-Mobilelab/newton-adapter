var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var NewtonMock;

describe('identity/signup', function () {
    beforeEach(function (done) {
        Mock.boostrap();
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;

        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function () {
            done();
        }).catch(done.fail);
    
    });

    afterEach(function () {
        NewtonAdapter.resetForTest();
    });

    it('signup complete flow', function (done) {
        NewtonAdapter.signup({
            email: 'mail@gmail.com',
            password: 'mailpwd',
            customData: {
                track: 'signup mail@gmail.com'
            },
            userProperties: {
                name: 'mail'
            } 
        }).then(function () {
            expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalled();
            expect(NewtonMock.setEmail).toHaveBeenCalledWith('mail@gmail.com');
            expect(NewtonMock.setPassword).toHaveBeenCalledWith('mailpwd');
            expect(NewtonMock.setCustomData).toHaveBeenCalledWith({ track: 'signup mail@gmail.com' });
            expect(NewtonMock.setUserProperties).toHaveBeenCalledWith({ name: 'mail'});
            expect(NewtonMock.getEmailSignupFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(done.fail);
    });


    it('signup flow without custom data', function (done) {
        NewtonAdapter.signup({
            email: 'mail@gmail.com',
            password: 'mailpwd',
            userProperties: {
                name: 'mail'
            }
        }).then(function () {
            expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalled();
            expect(NewtonMock.setEmail).toHaveBeenCalledWith('mail@gmail.com');
            expect(NewtonMock.setPassword).toHaveBeenCalledWith('mailpwd');
            expect(NewtonMock.setCustomData).not.toHaveBeenCalled();
            expect(NewtonMock.setUserProperties).toHaveBeenCalledWith({ name: 'mail' });
            expect(NewtonMock.getEmailSignupFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(done.fail);
    });

    it('signup flow without user properties', function (done) {
        NewtonAdapter.signup({
            email: 'mail@gmail.com',
            password: 'mailpwd',
            customData: {
                track: 'signup mail@gmail.com'
            },
        }).then(function () {
            expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalled();
            expect(NewtonMock.setEmail).toHaveBeenCalledWith('mail@gmail.com');
            expect(NewtonMock.setPassword).toHaveBeenCalledWith('mailpwd');
            expect(NewtonMock.setCustomData).toHaveBeenCalledWith({ track: 'signup mail@gmail.com' });
            expect(NewtonMock.setUserProperties).not.toHaveBeenCalled();
            expect(NewtonMock.getEmailSignupFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(done.fail);
    });

    it('signup flow without user properties and custom data', function (done) {
        NewtonAdapter.signup({
            email: 'mail@gmail.com',
            password: 'mailpwd'
        }).then(function () {
            expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalled();
            expect(NewtonMock.setEmail).toHaveBeenCalledWith('mail@gmail.com');
            expect(NewtonMock.setPassword).toHaveBeenCalledWith('mailpwd');
            expect(NewtonMock.setCustomData).not.toHaveBeenCalled();
            expect(NewtonMock.setUserProperties).not.toHaveBeenCalled();
            expect(NewtonMock.getEmailSignupFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(done.fail);
    });

    it('signup flow fail', function (done) {
        NewtonAdapter.signup({ }).then(function () {
            done.fail();
        }).catch(function(){
            expect(NewtonMock.setOnFlowCompleteCallback).not.toHaveBeenCalled();
            expect(NewtonMock.setEmail).not.toHaveBeenCalled();
            expect(NewtonMock.setPassword).not.toHaveBeenCalled();
            expect(NewtonMock.setCustomData).not.toHaveBeenCalled();
            expect(NewtonMock.setUserProperties).not.toHaveBeenCalled();
            expect(NewtonMock.getEmailSignupFlow).not.toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).not.toHaveBeenCalled();
            done();            
        });
    });
});