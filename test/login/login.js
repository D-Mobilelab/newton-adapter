var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var NewtonMock;

describe('login/login', function(){
    var userId = '111222333444';
    var userProperties = {
        msisdn: '+39123456789'
    };
    var msisdn = '+39123456789';
    var pin = '1234';  
    var domain = 'www.gameasy.com';  
    var provider = 'facebook';  
    var accessToken = '1234567890abcedf';  
    
    describe('version 2', function(){    
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

        it('custom', function(done){
            NewtonAdapter.login({
                logged: true,
                type: 'custom',
                userId: userId,
                userProperties: userProperties
            }).then(function(){
                expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
                expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
                expect(NewtonMock.setCustomID).toHaveBeenCalledWith(userId);
                expect(NewtonMock.getCustomLoginFlow).toHaveBeenCalled();
                expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('external', function(done){
            NewtonAdapter.login({
                logged: true,
                type: 'external',
                userId: userId,
                userProperties: userProperties            
            }).then(function(){
                expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
                expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
                expect(NewtonMock.setExternalID).toHaveBeenCalledWith(userId);
                expect(NewtonMock.getExternalLoginFlow).toHaveBeenCalled();
                expect(NewtonMock.startLoginFlow).toHaveBeenCalled();       
                done();
            }).catch(function(reason){
                done.fail(reason);
            });        
        });

        it('msisdn', function(done){
            NewtonAdapter.login({
                logged: true,
                type: 'msisdn',
                msisdn: msisdn,
                pin: pin
            }).then(function(){
                expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
                expect(NewtonMock.setMSISDN).toHaveBeenCalledWith(msisdn);
                expect(NewtonMock.setPIN).toHaveBeenCalledWith(pin);
                expect(NewtonMock.getMSISDNPINLoginFlow).toHaveBeenCalled();
                expect(NewtonMock.startLoginFlow).toHaveBeenCalled();       
                done();
            }).catch(function(reason){
                done.fail(reason);
            });        
        });

        it('autologin', function(done){
            NewtonAdapter.login({
                logged: true,
                type: 'autologin',
                domain: domain
            }).then(function(){
                expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
                expect(NewtonMock.__setDomain).toHaveBeenCalledWith(domain);
                expect(NewtonMock.getMSISDNURLoginFlow).toHaveBeenCalled();
                expect(NewtonMock.startLoginFlow).toHaveBeenCalled();       
                done();
            }).catch(function(reason){
                done.fail(reason);
            });        
        });

        it('oauth', function(done){
            NewtonAdapter.login({
                logged: true,
                type: 'oauth',
                provider: provider,
                access_token: accessToken
            }).then(function(){
                expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
                expect(NewtonMock.setOAuthProvider).toHaveBeenCalledWith(provider);
                expect(NewtonMock.setAccessToken).toHaveBeenCalledWith(accessToken);
                expect(NewtonMock.getOAuthLoginFlow).toHaveBeenCalled();
                expect(NewtonMock.startLoginFlow).toHaveBeenCalled();       
                done();
            }).catch(function(reason){
                done.fail(reason);
            });        
        });
    });

    describe('version 1', function(){    
        beforeEach(function(done){
            Mock.boostrap();
            NewtonMock = Mock.NewtonMock;
            Newton = Mock.Newton;

            var secretId = '<local_host>';        
            var customLogger = { 
                debug: function(){},
                log: function(){},
                info: function(){},
                warn: function(){},
                error: function(){}
            };
            spyOn(customLogger, 'warn');
            spyOn(customLogger, 'error');

            NewtonAdapter.init({
                secretId: secretId,
                enable: true,
                waitLogin: false,
                logger: customLogger,
                properties: { bridgeId: '123123123' },
                newtonversion: 1
            }).then(function(){
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        afterEach(function(){
            NewtonAdapter.resetForTest();
        });

        it('login returns an error if login type is external', function(done){
            NewtonAdapter.login({
                logged: true,
                type: 'external'
            }).then(function(){
                done.fail();
            }).catch(function(reason){
                done();
            });
        });

        it('login makes custom login correctly', function(done){
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
                expect(NewtonMock.setLoginData).toHaveBeenCalledWith(userProperties);
                // expect(NewtonMock.setCallback).toHaveBeenCalledWith(callbackMethod.call();
                expect(NewtonMock.setCustomID).toHaveBeenCalledWith(userId);
                expect(NewtonMock.getCustomFlow).toHaveBeenCalled();
                expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        });
    });
});