window.Newton = require('./NewtonMock');
var NewtonAdapter = require('../src/main');

/* INIT */
describe('init -', function(){
    fit('call Newton.getSharedInstanceWithConfig with secretId', function(done){
        var secretId = '<local_host>';
        Newton.getSharedInstanceWithConfig = jasmine.createSpy();
        NewtonAdapter.init({
            secretId: secretId,
            enable: true
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId, {});
            expect(Newton.getSharedInstanceWithConfig.calls.count()).toEqual(1);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    fit('call Newton.getSharedInstanceWithConfig with secretId and properties', function(done){
        Newton.getSharedInstanceWithConfig = jasmine.createSpy('id');
        var secretId = '<local_host>';
        var properties = { bridgeId: '123123123' };
        NewtonAdapter.init({
            secretId: secretId,
            enable: true,
            properties: properties
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId, properties);
            expect(Newton.getSharedInstanceWithConfig.and.identity()).toEqual('id');
            expect(Newton.getSharedInstanceWithConfig.calls.count()).toEqual(1);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    describe('waitLogin: false - ', function(){
        beforeEach(function(){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: false
            });
        });

        it('trackEvent doesn\'t wait login', function(done){
            NewtonMock.sendEvent = jasmine.createSpy('sendEventAtLogin');
            NewtonAdapter.trackEvent('Play').then(function(){
                expect(NewtonMock.sendEvent).toHaveBeenCalled();
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('startHeartbeat doesn\'t wait login', function(done){
            NewtonAdapter.startHeartbeat('Play').then(function(){
                expect(NewtonMock.timedEventStart).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('stopHeartbeat doesn\'t wait login', function(done){
            NewtonAdapter.stopHeartbeat('Play').then(function(){
                expect(NewtonMock.timedEventStop).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });
    });

    describe('waitLogin: true - ', function(){
        beforeEach(function(){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: true
            });
        });

        it('trackEvent waits login', function(done){
            NewtonAdapter.trackEvent('Play');
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(Newton.calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('sendEvent'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('startHeartbeat waits login', function(done){
            NewtonAdapter.startHeartbeat('Play');
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(Newton.calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('timedEventStart'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('stopHeartbeat waits login', function(done){
            NewtonAdapter.stopHeartbeat('Play');
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(Newton.calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('timedEventStop'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });
    });

    describe('enable: false - ', function(){
        var customLogger, initPromise;
        beforeEach(function(){
            customLogger = { 
                debug: function(){},
                log: function(){},
                info: function(){},
                warn: function(){},
                error: function(){}
            };
            spyOn(customLogger, 'warn');

            initPromise = NewtonAdapter.init({
                secretId: '<local_host>',
                enable: false,
                waitLogin: false,
                logger: customLogger
            });
        });

        it('correct warning is called', function(done){
            initPromise.then(function(){
                done.fail();
            }).catch(function(reason){
                expect(reason).toEqual(new Error('Newton not enabled'));
                expect(customLogger.warn).toHaveBeenCalledWith('NewtonAdapter', 'Newton not enabled');
                done();
            });
        });

        it('trackEvent doesn\'t run anything', function(done){
            NewtonAdapter.trackEvent('Play').then(function(){
                done.fail();
            }).catch(function(){
                expect(NewtonMock.sendEvent).not.toHaveBeenCalled();
                done();
            });
        });

        it('startHeartbeat doesn\'t run anything', function(done){
            NewtonAdapter.startHeartbeat('Play').then(function(){
                done.fail();
            }).catch(function(){
                expect(NewtonMock.timedEventStart).not.toHaveBeenCalled();
                done();
            });
        });

        it('stopHeartbeat doesn\'t run anything', function(done){
            NewtonAdapter.stopHeartbeat('Play').then(function(){
                done.fail();
            }).catch(function(){
                expect(NewtonMock.timedEventStop).not.toHaveBeenCalled();
                done();
            });
        });
    });

    it('log have been called from init', function(done){
        var customLogger;

        customLogger = { 
            debug: function(){},
            log: function(){},
            info: function(){},
            warn: function(){},
            error: function(){}
        };
        spyOn(customLogger, 'log');

        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false,
            logger: customLogger
        }).then(function(){
            expect(customLogger.log).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
        
    });

    it('check if Newton exist', function(done){
        Newton = undefined;

        customLogger = { 
            debug: function(){},
            log: function(){},
            info: function(){},
            warn: function(){},
            error: function(){}
        };
        spyOn(customLogger, 'error');

        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false,
            logger: customLogger
        }).then(function(){
            done.fail(reason);
        }).catch(function(reason){
            expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'Newton not exist');
            expect(reason).toEqual(new Error('Newton not exist'));
            done();
        });
        
    });

    it('Newton is executed after deviceready event is triggered', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitDeviceReady: true
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalled();
            done();
        }).catch(done.fail);
        var event = new CustomEvent('deviceready', { detail: Date.now() });
        document.dispatchEvent(event);
    });
});
