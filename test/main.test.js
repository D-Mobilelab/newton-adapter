var NewtonAdapter = require('../src/main');
var loggedFlag, NewtonMock, calls;

beforeEach(function(){
    loggedFlag = false;
    calls = [];
    NewtonMock = {
        sendEvent: function(){ calls.push('sendEvent'); },
        timedEventStart: function(){ calls.push('timedEventStart'); },
        timedEventStop: function(){ calls.push('timedEventStop'); },
        isUserLogged: function(){ calls.push('isUserLogged'); return loggedFlag; },
        rankContent: function(){ calls.push('rankContent'); },
        getUserToken: function(){ calls.push('getUserToken'); },
        setUserStateChangeListener: function(callback){ calls.push('setUserStateChangeListener'); callback.call(); },
        // login
        getLoginBuilder: function(){ calls.push('getLoginBuilder'); return this; },
        setCustomData: function(){ calls.push('setCustomData'); return this; },
        setLoginData: function(){ calls.push('setLoginData'); return this; },
        setOnFlowCompleteCallback: function(){ calls.push('setOnFlowCompleteCallback'); return this; },
        setCallback: function(){ calls.push('setCallback'); return this; },
        setExternalID: function(){ calls.push('setExternalID'); return this; },
        setCustomID: function(){ calls.push('setCustomID'); return this; },
        getExternalLoginFlow: function(){ calls.push('getExternalLoginFlow'); return this; },
        getCustomFlow: function(){ calls.push('getCustomFlow'); return this; },
        getCustomLoginFlow: function(){ calls.push('getCustomLoginFlow'); return this; },
        startLoginFlow: function(){ calls.push('startLoginFlow'); return this; }
    };

    spyOn(NewtonMock, 'sendEvent').and.callThrough();
    spyOn(NewtonMock, 'timedEventStart').and.callThrough();
    spyOn(NewtonMock, 'timedEventStop').and.callThrough();
    spyOn(NewtonMock, 'isUserLogged').and.callThrough();
    spyOn(NewtonMock, 'rankContent').and.callThrough();
    spyOn(NewtonMock, 'getUserToken').and.callThrough();
    spyOn(NewtonMock, 'setUserStateChangeListener').and.callThrough();
    // login
    spyOn(NewtonMock, 'getLoginBuilder').and.callThrough();
    spyOn(NewtonMock, 'setCustomData').and.callThrough();
    spyOn(NewtonMock, 'setLoginData').and.callThrough();
    spyOn(NewtonMock, 'setOnFlowCompleteCallback').and.callThrough();
    spyOn(NewtonMock, 'setCallback').and.callThrough();
    spyOn(NewtonMock, 'setExternalID').and.callThrough();
    spyOn(NewtonMock, 'setCustomID').and.callThrough();
    spyOn(NewtonMock, 'getExternalLoginFlow').and.callThrough();
    spyOn(NewtonMock, 'getCustomFlow').and.callThrough();
    spyOn(NewtonMock, 'getCustomLoginFlow').and.callThrough();
    spyOn(NewtonMock, 'startLoginFlow').and.callThrough();

    Newton = {
        getSharedInstanceWithConfig: function(){ calls.push('getCustomFlow'); return NewtonMock; },
        getSharedInstance: function() { return NewtonMock; },
        SimpleObject: {
            fromJSONObject: function(obj){
                return obj;
            }
        }       
    };  

    spyOn(Newton, 'getSharedInstanceWithConfig').and.callThrough();
});

afterEach(function(){
    NewtonAdapter.resetForTest();
});


/* INIT */

describe('init -', function(){
    it('call Newton.getSharedInstanceWithConfig with secretId', function(done){
        var secretId = '<local_host>';
        NewtonAdapter.init({
            secretId: secretId,
            enable: true
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId, {});
            done();                        
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('call Newton.getSharedInstanceWithConfig with secretId and properties', function(done){
        var secretId = '<local_host>';
        var properties = { bridgeId: '123123123' };
        NewtonAdapter.init({
            secretId: secretId,
            enable: true,
            properties: properties
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId, properties);
            done();                        
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    describe('waitLogin: false - ', function(){
        beforeEach(function(){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: false
            });
        });

        it('trackEvent doesn\'t wait login', function(done){
            NewtonAdapter.trackEvent('Play').then(function(){
                expect(NewtonMock.sendEvent).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('startHeartbeat doesn\'t wait login', function(done){
            NewtonAdapter.startHeartbeat('Play').then(function(){
                expect(NewtonMock.timedEventStart).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('stopHeartbeat doesn\'t wait login', function(done){
            NewtonAdapter.stopHeartbeat('Play').then(function(){
                expect(NewtonMock.timedEventStop).toHaveBeenCalled();
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
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

        it('trackEvent waits login', function(done){
            NewtonAdapter.trackEvent('Play');
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('sendEvent'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('startHeartbeat waits login', function(done){
            NewtonAdapter.startHeartbeat('Play');
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('timedEventStart'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('stopHeartbeat waits login', function(done){
            NewtonAdapter.stopHeartbeat('Play');
            NewtonAdapter.login({ logged: false }).then(function(){
                expect(calls.indexOf('startLoginFlow')).toBeLessThan(calls.indexOf('timedEventStop'));
                done();                        
            }).catch(function(reason){
                done.fail(reason);
            });
        });
    });

    describe('enable: false - ', function(){
        var customLogger, initPromise;
        beforeEach(function(){
            customLogger = { 
                debug: function(){},
                log: function(){},
                info: function(){},
                warn: function(){},
                error: function(){}
            };
            spyOn(customLogger, 'warn');

            initPromise = NewtonAdapter.init({
                secretId: '<local_host>',
                enable: false,
                waitLogin: false,
                logger: customLogger
            });
        });

        it('correct warning is called', function(done){
            initPromise.then(function(){
                done.fail();
            }).catch(function(reason){
                expect(reason).toEqual(new Error('Newton not enabled'));
                expect(customLogger.warn).toHaveBeenCalledWith('NewtonAdapter', 'Newton not enabled');
                done();
            });
        });

        it('trackEvent doesn\'t run anything', function(done){
            NewtonAdapter.trackEvent('Play').then(function(){
                done.fail();
            }).catch(function(){
                expect(NewtonMock.sendEvent).not.toHaveBeenCalled();
                done();
            });
        });

        it('startHeartbeat doesn\'t run anything', function(done){
            NewtonAdapter.startHeartbeat('Play').then(function(){
                done.fail();
            }).catch(function(){
                expect(NewtonMock.timedEventStart).not.toHaveBeenCalled();
                done();
            });
        });

        it('stopHeartbeat doesn\'t run anything', function(done){
            NewtonAdapter.stopHeartbeat('Play').then(function(){
                done.fail();
            }).catch(function(){
                expect(NewtonMock.timedEventStop).not.toHaveBeenCalled();
                done();
            });
        });
    });

    it('log have been called from init', function(done){
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
        }).then(function(){
            expect(customLogger.log).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
        
    });

    it('check if Newton exist', function(done){
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
        }).then(function(){
            done.fail(reason);
        }).catch(function(reason){
            expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'Newton not exist');
            expect(reason).toEqual(new Error('Newton not exist'));
            done();
        });
        
    });

    it('Newton is executed after deviceready event is triggered', function(done){
        var event = new CustomEvent('deviceready', { detail: Date.now() });
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitDeviceReady: true
        }).then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalled();
            done();
        });
        document.dispatchEvent(event);
    });
});


/* LOGIN */

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

    it('external login', function(done){
        NewtonAdapter.login({
            logged: true,
            userId: userId,
            userProperties: userProperties,
            callback: callbackMethod,
            type: 'external'
        }).then(function(){
            expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
            expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
            // expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalledWith(callbackMethod.call();
            expect(NewtonMock.setExternalID).toHaveBeenCalledWith(userId);
            expect(NewtonMock.getExternalLoginFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });        
    });

    it('custom login', function(done){
        NewtonAdapter.login({
            logged: true,
            userId: userId,
            userProperties: userProperties,
            callback: callbackMethod
        }).then(function(){
            expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
            expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
            // expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalledWith(callbackMethod.call();
            expect(NewtonMock.setCustomID).toHaveBeenCalledWith(userId);
            expect(NewtonMock.getCustomLoginFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});


/* RANK CONTENT */

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

    it('rankContent() - if score is undefined, then default score is 1', function(done){
        NewtonAdapter.rankContent(properties).then(function(){
            expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, 1);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('rankContent() - calls Newton.rankContent with correct properties', function(done){
        properties.score = 4;
        NewtonAdapter.rankContent(properties).then(function(){
            expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, properties.score);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('trackEvent() - if score is undefined, then default score is 1', function(done){
        NewtonAdapter.trackEvent({
            name: 'Play',
            rank: properties
        }).then(function(){
            expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, 1);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('trackEvent() - calls Newton.rankContent with correct properties', function(done){
        properties.score = 4;
        NewtonAdapter.trackEvent({
            name: 'Play',
            rank: properties
        }).then(function(){
            expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, properties.score);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });        
    });

    it('trackPageview() - calls Newton.rankContent with correct properties', function(done){
        properties.score = 4;
        NewtonAdapter.trackPageview({
            url: 'http://www.google.it',
            rank: properties
        }).then(function(){
            expect(NewtonMock.rankContent).toHaveBeenCalledWith(properties.contentId, properties.scope, properties.score);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});


/* TRACK EVENT */

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


/* STOP HEARTBEAT */

describe('stopHeartbeat -', function(){
    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
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

    it('call Newton.timedEventStop with void properties', function(done){
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
});


/* IS LOGGED */

describe('isUserLogged -', function(){
    it('not call isUserLogged() before init', function(){
        NewtonAdapter.isUserLogged();
        expect(NewtonMock.isUserLogged).not.toHaveBeenCalled();
    });

    it('call isUserLogged() after init', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.isUserLogged();
            expect(NewtonMock.isUserLogged).toHaveBeenCalled();
            done();
        });
    });

    it('return right response', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            expect(NewtonAdapter.isUserLogged()).toEqual(Newton.getSharedInstance().isUserLogged());
            done();
        });
        // expect(NewtonAdapter.isUserLogged()).toEqual(Newton.getSharedInstance().isUserLogged());
    });
});

/* IS INITIALIZED */

describe('isInitialized -', function(){
    it('not call isUserLogged() before init', function(){
        NewtonAdapter.isUserLogged();
        expect(NewtonMock.isUserLogged).not.toHaveBeenCalled();
    });

    it('call isUserLogged() after init', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.isUserLogged();
            expect(NewtonMock.isUserLogged).toHaveBeenCalled();
            done();
        });
    });
});

/* GET USER TOKEN */

describe('getUserToken -', function(){
    it('getUserToken call relative Newton method', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.getUserToken();
            expect(NewtonMock.getUserToken).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('return false if you have not called init() yet', function(){
        var returnFlag = NewtonAdapter.getUserToken();
        expect(NewtonMock.getUserToken).not.toHaveBeenCalled();
        expect(returnFlag).toBe(false);
    });
});

/* SET USER STATE CHANGE LISTENER */

describe('setUserStateChangeListener -', function(){
    it('setUserStateChangeListener call relative Newton method and call callback', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            var mock = { callback: function(){} };
            spyOn(mock, 'callback').and.callThrough();
            NewtonAdapter.setUserStateChangeListener(mock.callback);
            expect(NewtonMock.setUserStateChangeListener).toHaveBeenCalled();
            expect(mock.callback).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('return false if you have not called init() yet', function(){
        var returnFlag = NewtonAdapter.setUserStateChangeListener();
        expect(NewtonMock.setUserStateChangeListener).not.toHaveBeenCalled();
        expect(returnFlag).toBe(false);
    });
});

/* NEWTON VERSION 1 */
describe('Newton version 1 - ', function(){
    var secretId = '<local_host>';
    var customLogger, promise;

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

        promise = NewtonAdapter.init({
            secretId: secretId,
            enable: true,
            waitLogin: false,
            logger: customLogger,
            properties: { bridgeId: '123123123' },
            newtonversion: 1
        }); 
    });

    it('init calls getSharedInstanceWithConfig only with secretId', function(done){
        promise.then(function(){
            expect(Newton.getSharedInstanceWithConfig).toHaveBeenCalledWith(secretId);
            expect(customLogger.warn).toHaveBeenCalledWith('NewtonAdapter', 'Newton v.1 not support properties on init method');
            done();
        }).catch(function(reason){
            done.fail();
        });
    });

    it('login returns an error if login type is external', function(done){
        NewtonAdapter.login({
            logged: true,
            type: 'external'
        }).then(function(){
            expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'Login', 'Newton v.1 not support external login');
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('login makes custom login correctly', function(done){
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
        }).then(function(){
            expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
            expect(NewtonMock.setLoginData).toHaveBeenCalledWith(userProperties);
            // expect(NewtonMock.setCallback).toHaveBeenCalledWith(callbackMethod.call();
            expect(NewtonMock.setCustomID).toHaveBeenCalledWith(userId);
            expect(NewtonMock.getCustomFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('rankContent returns an error', function(done){
        NewtonAdapter.rankContent({
            contentId: '123456777',
            scope: 'social'
        }).then(function(){
            expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('trackEvent returns an error if a rank properties is passed', function(done){
        NewtonAdapter.trackEvent({
            name: 'Play',
            rank: {
                contentId: '123456777',
                scope: 'social'
            }
        }).then(function(){
            expect(customLogger.error).toHaveBeenCalledWith('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});