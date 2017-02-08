window.NewtonMock = require('./NewtonMock');
var NewtonAdapter = require('../src/main');

/* STOP HEARTBEAT */
describe('stopHeartbeat -', function(){
    beforeEach(function(){        
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: true
        });
        NewtonAdapter.login({
            logged: true,
            userId: '123456789',
            userProperties: {},
            type: 'external'
        });

        NewtonAdapter.startHeartbeat();
        
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
        window.NewtonMock.resetCalls();
    });

    it('call Newton.timedEventStop with event name and properties', function(done){
        
        var eventName = 'Zoom-Nav';
        var eventProperties = { content: 'Fruit Slicer' };
        NewtonMock.timedEventStop = jasmine.createSpy('timedEventStop1');
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

    it('call Newton.timedEventStop with void properties', function(done){
        var eventName = 'Zoom-Nav';
        NewtonMock.timedEventStop = jasmine.createSpy('timedEventStop2');
        NewtonAdapter.stopHeartbeat({
            name: eventName
        }).then(function(){
            expect(NewtonMock.timedEventStop).toHaveBeenCalledWith(eventName, {});
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});