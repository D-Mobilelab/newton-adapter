/* global Newton Newton:true */
/* eslint-env jasmine */
var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var NewtonMock, customLogger, secretId;

describe('VERSION 1', function(){
    beforeEach(function(done){
        Mock.boostrap();
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;

        secretId = '<local_host>';        
        customLogger = { 
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

    it('init calls getSharedInstanceWithConfig only with secretId', function(){
        expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId);
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

    it('rankContent returns an error', function(done){
        NewtonAdapter.rankContent({
            contentId: '123456777',
            scope: 'social'
        }).then(function(){
            done.fail();
        }).catch(function(){
            done();
        });
    });

    it('trackEvent returns an error if a rank properties is passed', function(done){
        NewtonAdapter.trackEvent({
            name: 'Play',
            rank: {
                contentId: '123456777',
                scope: 'social'
            }
        }).then(function(){
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});