var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var NewtonMock, properties;

describe('tracking/rankContent', function(){
    describe('version 2', function(){
        beforeEach(function(done){
            Mock.boostrap();        
            NewtonMock = Mock.NewtonMock;
            Newton = Mock.Newton;

            properties = {
                contentId: '123456777',
                scope: 'social'
            };

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

    describe('version 1', function(){
        beforeEach(function(done){
            Mock.boostrap();
            NewtonMock = Mock.NewtonMock;
            Newton = Mock.Newton;

            var secretId = '<local_host>';        
            var customLogger = { 
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
            }).then(function(){
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        afterEach(function(){
            NewtonAdapter.resetForTest();
        });

        it('rankContent returns an error', function(done){
            NewtonAdapter.rankContent({
                contentId: '123456777',
                scope: 'social'
            }).then(function(){
                done.fail();
            }).catch(function(){
                done();
            });
        });
    });
});