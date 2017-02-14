var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var calls, NewtonMock;

describe('PAGEVIEW', function(){
    beforeEach(function(done){
        Mock.boostrap();
        calls = Mock.calls;
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

    it('call Newton.sendEvent with event "pageview"', function(done){
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