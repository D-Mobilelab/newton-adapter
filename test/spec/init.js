var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var calls, NewtonMock;

describe('INIT', function(){
    beforeEach(function(){
        Mock.boostrap();
        calls = Mock.calls;
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
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

    it('with waitLogin: false, trackEvent doesn\'t wait login', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.trackEvent('Play').then(function(){
                expect(NewtonMock.sendEvent).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });                        
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('with waitLogin: false, startHeartbeat doesn\'t wait login', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.startHeartbeat('Play').then(function(){
                expect(NewtonMock.timedEventStart).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });                        
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('with waitLogin: false, stopHeartbeat doesn\'t wait login', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.stopHeartbeat('Play').then(function(){
                expect(NewtonMock.timedEventStop).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });                        
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('with waitLogin: true, trackEvent waits login', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: true
        }).then(function(){
            NewtonAdapter.trackEvent('Play');
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('sendEvent'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });                     
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('with waitLogin: true, startHeartbeat waits login', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: true
        }).then(function(){
            NewtonAdapter.startHeartbeat('Play');
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('timedEventStart'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });                
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('with waitLogin: true, stopHeartbeat waits login', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: true
        }).then(function(){
            NewtonAdapter.stopHeartbeat('Play');
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('timedEventStop'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });            
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('with enable: false, trackEvent doesn\'t run anything', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: false,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.trackEvent('Play');
            expect(NewtonMock.sendEvent).not.toHaveBeenCalled();
            done();    
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('with enable: false, startHeartbeat doesn\'t run anything', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: false,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.startHeartbeat('Play');
            expect(NewtonMock.timedEventStart).not.toHaveBeenCalled();
            done();    
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('with enable: false, stopHeartbeat doesn\'t run anything', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: false,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.stopHeartbeat('Play');
            expect(NewtonMock.timedEventStop).not.toHaveBeenCalled();
            done();    
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    xit('if Newton doesn\'t exist, init is rejected', function(done){
        Newton = undefined;
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            done.fail(reason);
        }).catch(function(reason){
            expect(reason).toEqual(new Error('Newton not exist'));
            done();
        });
        
    });

    it('Newton is executed after deviceready event is triggered', function(done){
        var event = new CustomEvent('deviceready', { detail: Date.now() });
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitDeviceReady: true
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalled();
            done();
        });
        document.dispatchEvent(event);
    });
});