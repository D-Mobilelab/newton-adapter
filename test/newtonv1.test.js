window.Newton = require('./NewtonMock');
var NewtonAdapter = require('../src/main');
/* NEWTON VERSION 1 */
describe('Newton version 1 - ', function(){
    var secretId = '<local_host>';
    var customLogger, promise;

    beforeEach(function(){
        customLogger = { 
            debug: function(){},
            log: function(){},
            info: function(){},
            warn: function(){},
            error: function(){}
        };
        spyOn(customLogger, 'warn');
        spyOn(customLogger, 'error');

        promise = NewtonAdapter.init({
            secretId: secretId,
            enable: true,
            waitLogin: false,
            logger: customLogger,
            properties: { bridgeId: '123123123' },
            newtonversion: 1
        }); 
    });

    it('init calls getSharedInstanceWithConfig only with secretId', function(done){
        promise.then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId);
            expect(customLogger.warn).toHaveBeenCalledWith('NewtonAdapter', 'Newton v.1 not support properties on init method');
            done();
        }).catch(function(reason){
            done.fail();
        });
    });

    it('login returns an error if login type is external', function(done){
        NewtonAdapter.login({
            logged: true,
            type: 'external'
        }).then(function(){
            expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'Login', 'Newton v.1 not support external login');
            done();
        }).catch(function(reason){
            done.fail(reason);
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
            expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
            done();
        }).catch(function(reason){
            done.fail(reason);
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
            expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});