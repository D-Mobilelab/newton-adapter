var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var calls, NewtonMock;

describe('initialization/init', function(){
    beforeEach(function(){
        Mock.boostrap();
        calls = Mock.calls;
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

    it('if Newton not exist, reject Promise', function(done){
        var secretId = '<local_host>';
        Newton = undefined;
        NewtonAdapter.init({
            secretId: secretId,
            enable: true
        }).then(function(){
            done.fail();                  
        }).catch(function(){
            done(); 
        });
    });
    
    it('call Newton.getSharedInstanceWithConfig with secretId', function(done){
        var secretId = '<local_host>';
        NewtonAdapter.init({
            secretId: secretId,
            enable: true
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId, {});
            done();                        
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('call Newton.getSharedInstanceWithConfig with secretId and properties', function(done){
        var secretId = '<local_host>';
        var properties = { bridgeId: '123123123' };
        NewtonAdapter.init({
            secretId: secretId,
            enable: true,
            properties: properties
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId, properties);
            done();                        
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('version 1', function(done){
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

        expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId);
    });

    describe('with waitLogin: false', function(){
        beforeEach(function(done){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: false
            }).then(function(){
                done();
            }).catch(function(){
                done.fail();
            });
        });

        it('trackEvent doesn\'t wait login', function(done){
            NewtonAdapter.trackEvent({ name: 'Play' }).then(function(){
                expect(NewtonMock.sendEvent).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('startHeartbeat doesn\'t wait login', function(done){
            NewtonAdapter.startHeartbeat({ name: 'Play' }).then(function(){
                expect(NewtonMock.timedEventStart).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('stopHeartbeat doesn\'t wait login', function(done){
            NewtonAdapter.stopHeartbeat({ name: 'Play' }).then(function(){
                expect(NewtonMock.timedEventStop).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            }); 
        });
    });

    describe('with waitLogin: true', function(){
        beforeEach(function(done){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: true
            }).then(function(){
                done();
            }).catch(function(){
                done.fail();
            });
        });

        it('trackEvent waits login', function(done){
            NewtonAdapter.trackEvent({ name: 'Play' });
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('sendEvent'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            }); 
        });

        it('startHeartbeat waits login', function(done){
            NewtonAdapter.startHeartbeat({ name: 'Play' });
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('timedEventStart'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            }); 
        });

        it('stopHeartbeat waits login', function(done){
            NewtonAdapter.stopHeartbeat({ name: 'Play' });
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('timedEventStop'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });  
        });
    });

    describe('with enable: false', function(){
        beforeEach(function(done){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: false,
                waitLogin: false
            }).then(function(){
                done();
            }).catch(function(){
                done.fail();
            });
        });

        it('don\'t call Newton.getSharedInstanceWithConfig', function(){
            expect(Newton.getSharedInstanceWithConfig).not.toHaveBeenCalled();
        });

        it('trackEvent doesn\'t run anything', function(){
            NewtonAdapter.trackEvent({ name: 'Play' });
            expect(NewtonMock.sendEvent).not.toHaveBeenCalled();
        });

        it('startHeartbeat doesn\'t run anything', function(){
            NewtonAdapter.startHeartbeat({ name: 'Play' });
            expect(NewtonMock.timedEventStart).not.toHaveBeenCalled();
        });

        it('stopHeartbeat doesn\'t run anything', function(){
            NewtonAdapter.stopHeartbeat({ name: 'Play' });
            expect(NewtonMock.timedEventStop).not.toHaveBeenCalled();
        });
    });

    it('Newton is executed after deviceready event is triggered', function(done){
        var event = new CustomEvent('deviceready', { detail: Date.now() });
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitDeviceReady: true
        }).then(function() {
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalled();
            done();
        });
        document.dispatchEvent(event);
    });

    it('Newton.getSharedInstanceWithConfig to be executed with pushCallback params', function(done){
        function onPush(pushData) {}
        var event = new CustomEvent('deviceready', { detail: Date.now() });
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitDeviceReady: true,
            pushCallback: onPush
        }).then(function() {
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith('<local_host>', {}, onPush);
            done();
        });
        document.dispatchEvent(event);
    });
});