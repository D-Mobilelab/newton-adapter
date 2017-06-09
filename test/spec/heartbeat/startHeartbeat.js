var NewtonAdapter = require('../../../src/main');
var Mock = require('../../mock');
var NewtonMock;

describe('heartbeat/startHeartbeat', function(){
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

    it('call Newton.timedEventStart without anything', function(done){
        NewtonAdapter.startHeartbeat().then(function(){
            done.fail();
        }).catch(function(){
            done();
        });
    });

    it('call Newton.timedEventStart with event name', function(done){
        var eventName = 'Zoom-Nav';
        NewtonAdapter.startHeartbeat({
            name: eventName
        }).then(function(){
            expect(NewtonMock.timedEventStart).toHaveBeenCalledWith(eventName, {});
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('call Newton.timedEventStart with event name and properties', function(done){
        var eventName = 'Zoom-Nav';
        var eventProperties = { content: 'Fruit Slicer' };
        NewtonAdapter.startHeartbeat({
            name: eventName,
            properties: eventProperties
        }).then(function(){
            expect(NewtonMock.timedEventStart).toHaveBeenCalledWith(eventName, eventProperties);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    
});