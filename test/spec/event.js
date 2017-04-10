/* global Newton Newton:true */
/* eslint-env jasmine */
var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var NewtonMock;

describe('EVENT', function(){
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