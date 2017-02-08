/* TRACK EVENT */
window.Newton = require('./NewtonMock');
var NewtonAdapter = require('../src/main');
describe('trackEvent -', function(){
    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
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

    it('call Newton.sendEvent with void properties', function(done){
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
});