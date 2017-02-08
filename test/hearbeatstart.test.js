window.Newton = require('./NewtonMock');
var NewtonAdapter = require('../src/main');
/* START HEARTBEAT */

describe('startHeartbeat -', function(){
    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
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

    it('call Newton.timedEventStart with void properties', function(done){
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
});