/* global Newton Newton:true */
/* eslint-env jasmine */
var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var NewtonMock;

describe('LOGIN', function(){
    var userId = '111222333444';
    var userProperties = {
        msisdn: '+39123456789'
    };
    var msisdn = '+39123456789';
    var pin = '1234';  
    var domain = 'www.gameasy.com';  
    var provider = 'facebook';  
    var accessToken = '1234567890abcedf';  
    
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

    describe('LOGOUT', function(){
        it('as logged', function(done){
            NewtonAdapter.login({
                logged: true,
                type: 'external',
                userId: userId,
                userProperties: userProperties
            }).then(function(){
                NewtonAdapter.logout().then(function(){
                    expect(NewtonMock.userLogout).toHaveBeenCalled();   
                    done();
                }).catch(function(reason){
                    done.fail(reason);
                });
            }).catch(function(reason){
                done.fail(reason);
            });   
        }); 

        it('as unlogged', function(done){
            NewtonAdapter.logout().then(function(){
                expect(NewtonMock.userLogout).not.toHaveBeenCalled();   
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        });
    });

    it('RECOVER PASSWORD', function(done){
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