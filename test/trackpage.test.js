window.Newton = require('./NewtonMock');
var NewtonAdapter = require('../src/main');

/* TRACK PAGEVIEW */

describe('trackPageview -', function(){
    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        });
    });

    it('call Newton.sendEvent with event "pageview" and properties, with url', function(done){
        var eventProperties = { 
            content: 'Fruit Slicer',
            url: 'http://www.google.com' 
        };
        NewtonAdapter.trackPageview({
            properties: eventProperties
        }).then(function(){
            expect(NewtonMock.sendEvent).toHaveBeenCalledWith('pageview', eventProperties);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('call Newton.sendEvent with event "pageview" and properties, without url', function(done){
        var eventProperties = { 
            content: 'Fruit Slicer'
        };
        NewtonAdapter.trackPageview({
            properties: eventProperties
        }).then(function(){
            eventProperties.url = window.location.href;
            expect(NewtonMock.sendEvent).toHaveBeenCalledWith('pageview', eventProperties);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('call Newton.sendEvent with event "pageview" and void properties', function(done){
        var eventProperties = { 
            url: window.location.href 
        };
        NewtonAdapter.trackPageview().then(function(){
            expect(NewtonMock.sendEvent).toHaveBeenCalledWith('pageview', eventProperties);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});