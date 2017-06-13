var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var NewtonMock;

describe('tracking/trackEvent', function(){
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

        it('call Newton.sendEvent with event name', function(done){
            var eventName = 'Play';
            NewtonAdapter.trackEvent({
                name: eventName
            }).then(function(){
                expect(NewtonMock.sendEvent).toHaveBeenCalledWith(eventName, {});
                done();
            }).catch(function(reason){
                done.fail(reason);
            });        
        });

        it('call Newton.sendEvent with event name and properties', function(done){
            var eventName = 'Play';
            var eventProperties = { content: 'Fruit Slicer' };
            NewtonAdapter.trackEvent({
                name: eventName,
                properties: eventProperties
            }).then(function(){
                expect(NewtonMock.sendEvent).toHaveBeenCalledWith(eventName, eventProperties);
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
});