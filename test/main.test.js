var NewtonAdapter = require('../src/main');
var loggedFlag, NewtonMock;

beforeEach(function(){
    loggedFlag = false;
    NewtonMock = {
        isUserLogged: function(){},
        sendEvent: function(){},
        timedEventStart: function(){},
        timedEventStop: function(){},
        isUserLogged: function(){ return loggedFlag; },
        rankContent: function(){},
        // login
        getLoginBuilder: function(){ return this; },
        setCustomData: function(){ return this; },
        setLoginData: function(){ return this; },
        setOnFlowCompleteCallback: function(){ return this; },
        setCallback: function(){ return this; },
        setExternalID: function(){ return this; },
        setCustomID: function(){ return this; },
        getExternalLoginFlow: function(){ return this; },
        getCustomFlow: function(){ return this; },
        getCustomLoginFlow: function(){ return this; },
        startLoginFlow: function(){ return this; }
    };

    spyOn(NewtonMock, "sendEvent").and.callThrough();
    spyOn(NewtonMock, "timedEventStart").and.callThrough();
    spyOn(NewtonMock, "timedEventStop").and.callThrough();
    spyOn(NewtonMock, "isUserLogged").and.callThrough();
    spyOn(NewtonMock, "rankContent").and.callThrough();
    // login
    spyOn(NewtonMock, "getLoginBuilder").and.callThrough();
    spyOn(NewtonMock, "setCustomData").and.callThrough();
    spyOn(NewtonMock, "setLoginData").and.callThrough();
    spyOn(NewtonMock, "setOnFlowCompleteCallback").and.callThrough();
    spyOn(NewtonMock, "setCallback").and.callThrough();
    spyOn(NewtonMock, "setExternalID").and.callThrough();
    spyOn(NewtonMock, "setCustomID").and.callThrough();
    spyOn(NewtonMock, "getExternalLoginFlow").and.callThrough();
    spyOn(NewtonMock, "getCustomFlow").and.callThrough();
    spyOn(NewtonMock, "getCustomLoginFlow").and.callThrough();
    spyOn(NewtonMock, "startLoginFlow").and.callThrough();

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

afterEach(function(){
    NewtonAdapter.resetForTest();
});


/*** INIT ***/

describe('init -', function(){
    it('call Newton.getSharedInstanceWithConfig with secretId', function(){
        var secretId = '<local_host>';
        NewtonAdapter.init({
            secretId: secretId,
            enable: true
        });
        expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId, {});
    });

    it('call Newton.getSharedInstanceWithConfig with secretId and properties', function(){
        var secretId = '<local_host>';
        var properties = { bridgeId: '123123123' };
        NewtonAdapter.init({
            secretId: secretId,
            enable: true,
            properties: properties
        });
        expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId, properties);
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
            customLogger = { 
                debug: function(){},
                log: function(){},
                info: function(){},
                warn: function(){},
                error: function(){}
            };
            spyOn(customLogger, 'warn');

            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: false,
                waitLogin: false,
                logger: customLogger
            });
        });

        it('correct warning is called', function(){
            expect(customLogger.warn).toHaveBeenCalledWith('NewtonAdapter', 'Newton not enabled');
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

    it('log have been called from init', function(){
        var customLogger;

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

        expect(customLogger.log).toHaveBeenCalled();
    });

    it('check if Newton exist', function(){
        Newton = undefined;

        customLogger = { 
            debug: function(){},
            log: function(){},
            info: function(){},
            warn: function(){},
            error: function(){}
        };
        spyOn(customLogger, 'error');

        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false,
            logger: customLogger
        });

        expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'Newton not exist');
    });
});


/*** LOGIN ***/

describe('login - ', function(){
    var userId = '111222333444';
    var userProperties = {
        msisdn: '+39123456789'
    };
    var callbackMethod = function(){};

    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        });
    });

    it('external login', function(){
        NewtonAdapter.login({
            logged: true,
            userId: userId,
            userProperties: userProperties,
            callback: callbackMethod,
            type: 'external'
        });

        expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
        expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
        // expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalledWith(callbackMethod.call();
        expect(NewtonMock.setExternalID).toHaveBeenCalledWith(userId);
        expect(NewtonMock.getExternalLoginFlow).toHaveBeenCalled();
        expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
    });

    it('custom login', function(){
        NewtonAdapter.login({
            logged: true,
            userId: userId,
            userProperties: userProperties,
            callback: callbackMethod
        });

        expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
        expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
        // expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalledWith(callbackMethod.call();
        expect(NewtonMock.setCustomID).toHaveBeenCalledWith(userId);
        expect(NewtonMock.getCustomLoginFlow).toHaveBeenCalled();
        expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
    });
});


/*** RANK CONTENT ***/

describe('rankContent -', function(){
    var properties;

    beforeEach(function(){
        properties = {
            contentId: '123456777',
            scope: 'social'
        };
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        });
    });

    it('rankContent() - if score is undefined, then default score is 1', function(){
        NewtonAdapter.rankContent(properties);
        expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, 1);
    });

    it('rankContent() - calls Newton.rankContent with correct properties', function(){
        properties.score = 4;
        NewtonAdapter.rankContent(properties);
        expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, properties.score);
    });

    it('trackEvent() - if score is undefined, then default score is 1', function(){
        NewtonAdapter.trackEvent({
            name: 'Play',
            rank: properties
        });
        expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, 1);
    });

    it('trackEvent() - calls Newton.rankContent with correct properties', function(){
        properties.score = 4;
        NewtonAdapter.trackEvent({
            name: 'Play',
            rank: properties
        });
        expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, properties.score);
    });

    it('trackPageview() - calls Newton.rankContent with correct properties', function(){
        properties.score = 4;
        NewtonAdapter.trackPageview({
            url: 'http://www.google.it',
            rank: properties
        });
        expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, properties.score);
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

describe('isUserLogged -', function(){
    it('call Newton.getSharedInstance().isUserLogged() and return right response', function(){
        NewtonAdapter.isUserLogged();
        expect(NewtonMock.isUserLogged).toHaveBeenCalled();
    });

    it('return right response', function(){
        expect(NewtonAdapter.isUserLogged()).toEqual(Newton.getSharedInstance().isUserLogged());
    });
});

/*** IS INITIALIZED ***/

describe('isInitialized -', function(){
    it('return true if you have called init() before', function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        });
        expect(NewtonAdapter.isInitialized()).toBe(true);
    });

    it('return false if you have not called init() yet', function(){
        expect(NewtonAdapter.isInitialized()).toBe(false);
    });
});


/*** NEWTON VERSION 1 ***/
describe('Newton version 1 - ', function(){
    var secretId = '<local_host>';

    beforeEach(function(){
       customLogger = { 
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
        }); 
    });

    it('init calls getSharedInstanceWithConfig only with secretId', function(){
        expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId);
        expect(customLogger.warn).toHaveBeenCalledWith('NewtonAdapter', 'Newton v.1 not support properties on init method');
    });

    it('login returns an error if login type is external', function(){
        NewtonAdapter.login({
            logged: true,
            type: 'external'
        });
        expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'Login', 'Newton v.1 not support external login');
    });

    it('login makes custom login correctly', function(){
        var userId = '111222333444';
        var userProperties = {
            msisdn: '+39123456789'
        };
        var callbackMethod = function(){};

        NewtonAdapter.login({
            logged: true,
            userId: userId,
            userProperties: userProperties,
            callback: callbackMethod
        });

        expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
        expect(NewtonMock.setLoginData).toHaveBeenCalledWith(userProperties);
        // expect(NewtonMock.setCallback).toHaveBeenCalledWith(callbackMethod.call();
        expect(NewtonMock.setCustomID).toHaveBeenCalledWith(userId);
        expect(NewtonMock.getCustomFlow).toHaveBeenCalled();
        expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
    });

    it('rankContent returns an error', function(){
        NewtonAdapter.rankContent({
            contentId: '123456777',
            scope: 'social'
        });
        expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
    });

    it('trackEvent returns an error if a rank properties is passed', function(){
        NewtonAdapter.trackEvent({
            name: 'Play',
            rank: {
                contentId: '123456777',
                scope: 'social'
            }
        });
        expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
    });
});