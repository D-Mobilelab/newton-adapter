window.Newton = require('./NewtonMock');
var NewtonAdapter = require('../src/main');
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
