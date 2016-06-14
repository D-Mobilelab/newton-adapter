var NewtonAdapter = require('../src/main');
var loggedFlag;
var NewtonMock;

beforeEach(function(){
    loggedFlag = false;

    NewtonMock = {
        isUserLogged: function(){},
        sendEvent: function(){},
        timedEventStart: function(){},
        timedEventStop: function(){},
        isUserLogged: function(){ return loggedFlag; }
    };

    spyOn(NewtonMock, "sendEvent").and.callThrough();
    spyOn(NewtonMock, "timedEventStart").and.callThrough();
    spyOn(NewtonMock, "timedEventStop").and.callThrough();
    spyOn(NewtonMock, "isUserLogged").and.callThrough();

    Newton = {
        getSharedInstanceWithConfig: function(){ return NewtonMock; },
        getSharedInstance: function() { return NewtonMock },
        SimpleObject: {
            fromJSONObject: function(obj){
                return obj;
            }
        }       
    };  

    spyOn(Newton, "getSharedInstanceWithConfig").and.callThrough();
});


/*** INIT ***/

describe('init -', function(){
    it('call Newton.getSharedInstanceWithConfig with secretId', function(){
        var secretId = '<local_host>';
        NewtonAdapter.init({
            secretId: secretId,
            enable: true
        });
        expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId);
    });

    describe('waitLogin: false - ', function(){
        beforeEach(function(){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: false
            });
        });

        it('trackEvent doesn\'t wait login', function(){
            NewtonAdapter.trackEvent('Play');
            expect(NewtonMock.sendEvent).toHaveBeenCalled();
        });

        it('startHeartbeat doesn\'t wait login', function(){
            NewtonAdapter.startHeartbeat('Play');
            expect(NewtonMock.timedEventStart).toHaveBeenCalled();
        });

        it('stopHeartbeat doesn\'t wait login', function(){
            NewtonAdapter.stopHeartbeat('Play');
            expect(NewtonMock.timedEventStop).toHaveBeenCalled();
        });
    });

    describe('waitLogin: true - ', function(){
        beforeEach(function(){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: true
            });
        });

        it('trackEvent waits login', function(){
            NewtonAdapter.trackEvent('Play');
            expect(NewtonMock.sendEvent).not.toHaveBeenCalled();
            NewtonAdapter.login({ logged: false });
            expect(NewtonMock.sendEvent).toHaveBeenCalled();
        });

        it('startHeartbeat waits login', function(){
            NewtonAdapter.startHeartbeat('Play');
            expect(NewtonMock.timedEventStart).not.toHaveBeenCalled();
            NewtonAdapter.login({ logged: false });
            expect(NewtonMock.timedEventStart).toHaveBeenCalled();
        });

        it('stopHeartbeat waits login', function(){
            NewtonAdapter.stopHeartbeat('Play');
            expect(NewtonMock.timedEventStop).not.toHaveBeenCalled();
            NewtonAdapter.login({ logged: false });
            expect(NewtonMock.timedEventStop).toHaveBeenCalled();
        });
    });

    describe('enable: false - ', function(){
        beforeEach(function(){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: false,
                waitLogin: false
            });
        });

        it('trackEvent doesn\'t run anything', function(){
            NewtonAdapter.trackEvent('Play');
            expect(NewtonMock.sendEvent).not.toHaveBeenCalled();
        });

        it('startHeartbeat doesn\'t run anything', function(){
            NewtonAdapter.startHeartbeat('Play');
            expect(NewtonMock.timedEventStart).not.toHaveBeenCalled();
        });

        it('stopHeartbeat doesn\'t run anything', function(){
            NewtonAdapter.stopHeartbeat('Play');
            expect(NewtonMock.timedEventStop).not.toHaveBeenCalled();
        });
    });

    describe('custom logger -', function(){
        var customLogger;

        beforeEach(function(){
            customLogger = { 
                debug: function(){},
                log: function(){},
                info: function(){},
                warn: function(){},
                error: function(){}
            };
            spyOn(customLogger, 'log');

            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: false,
                logger: customLogger
            });
        });

        it('log have been called from init', function(){
            expect(customLogger.log).toHaveBeenCalled();
        });
    });
});


/*** TRACK EVENT ***/

describe('trackEvent -', function(){
    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        });
    });

    it('call Newton.sendEvent with event name and properties', function(){
        var eventName = 'Play';
        var eventProperties = { content: 'Fruit Slicer' };
        NewtonAdapter.trackEvent({
            name: eventName,
            properties: eventProperties
        });
        expect(NewtonMock.sendEvent).toHaveBeenCalledWith(eventName, eventProperties);
    });

    it('call Newton.sendEvent with void properties', function(){
        var eventName = 'Play';
        NewtonAdapter.trackEvent({
            name: eventName
        });
        expect(NewtonMock.sendEvent).toHaveBeenCalledWith(eventName, {});
    });
});


/*** TRACK PAGEVIEW ***/

describe('trackPageview -', function(){
    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        });
    });

    it('call Newton.sendEvent with event "pageview" and properties, with url', function(){
        var eventProperties = { 
            content: 'Fruit Slicer',
            url: 'http://www.google.com' 
        };
        NewtonAdapter.trackPageview({
            properties: eventProperties
        });
        expect(NewtonMock.sendEvent).toHaveBeenCalledWith("pageview", eventProperties);
    });

    it('call Newton.sendEvent with event "pageview" and properties, without url', function(){
        var eventProperties = { 
            content: 'Fruit Slicer'
        };
        NewtonAdapter.trackPageview({
            properties: eventProperties
        });
        eventProperties['url'] = window.location.href;
        expect(NewtonMock.sendEvent).toHaveBeenCalledWith("pageview", eventProperties);
    });

    it('call Newton.sendEvent with event "pageview" and void properties', function(){
        var eventProperties = { 
            url: window.location.href 
        };
        NewtonAdapter.trackPageview();
        expect(NewtonMock.sendEvent).toHaveBeenCalledWith("pageview", eventProperties);
    });
});


/*** START HEARTBEAT ***/

describe('startHeartbeat -', function(){
    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        });
    });

    it('call Newton.timedEventStart with event name and properties', function(){
        var eventName = 'Zoom-Nav';
        var eventProperties = { content: 'Fruit Slicer' };
        NewtonAdapter.startHeartbeat({
            name: eventName,
            properties: eventProperties
        });
        expect(NewtonMock.timedEventStart).toHaveBeenCalledWith(eventName, eventProperties);
    });

    it('call Newton.timedEventStart with void properties', function(){
        var eventName = 'Zoom-Nav';
        NewtonAdapter.startHeartbeat({
            name: eventName
        });
        expect(NewtonMock.timedEventStart).toHaveBeenCalledWith(eventName, {});
    });
});


/*** STOP HEARTBEAT ***/

describe('stopHeartbeat -', function(){
    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        });
    });

    it('call Newton.timedEventStop with event name and properties', function(){
        var eventName = 'Zoom-Nav';
        var eventProperties = { content: 'Fruit Slicer' };
        NewtonAdapter.stopHeartbeat({
            name: eventName,
            properties: eventProperties
        });
        expect(NewtonMock.timedEventStop).toHaveBeenCalledWith(eventName, eventProperties);
    });

    it('call Newton.timedEventStop with void properties', function(){
        var eventName = 'Zoom-Nav';
        NewtonAdapter.stopHeartbeat({
            name: eventName
        });
        expect(NewtonMock.timedEventStop).toHaveBeenCalledWith(eventName, {});
    });
});


/*** IS LOGGED ***/

describe('isLogged -', function(){
    it('call Newton.getSharedInstance().isUserLogged() and return right response', function(){
        NewtonAdapter.isLogged();
        expect(NewtonMock.isUserLogged).toHaveBeenCalled();
    });

    it('return right response', function(){
        expect(NewtonAdapter.isLogged()).toEqual(Newton.getSharedInstance().isUserLogged());
    });
});