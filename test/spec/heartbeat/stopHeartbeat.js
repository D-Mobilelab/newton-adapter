var NewtonAdapter = require('../../../src/main');
var Mock = require('../../mock');
var NewtonMock;

describe('heartbeat/stopHeartbeat', function(){
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

    it('call Newton.timedEventStop without anything', function(done){
        NewtonAdapter.stopHeartbeat().then(function(){
            done.fail();
        }).catch(function(){
            done();
        });
    });

    it('call Newton.timedEventStop with event name', function(done){
        var eventName = 'Zoom-Nav';
        NewtonAdapter.stopHeartbeat({
            name: eventName
        }).then(function(){
            expect(NewtonMock.timedEventStop).toHaveBeenCalledWith(eventName, {});
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('call Newton.timedEventStop with event name and properties', function(done){
        var eventName = 'Zoom-Nav';
        var eventProperties = { content: 'Fruit Slicer' };
        NewtonAdapter.stopHeartbeat({
            name: eventName,
            properties: eventProperties
        }).then(function(){
            expect(NewtonMock.timedEventStop).toHaveBeenCalledWith(eventName, eventProperties);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});