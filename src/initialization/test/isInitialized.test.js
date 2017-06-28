var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var calls, NewtonMock;

describe('initialization/isInitialized', function(){
    beforeEach(function(){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

    it('return true if you have called init() before', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            expect(NewtonAdapter.isInitialized()).toBe(true);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('return false if you have not called init() yet', function(){
        expect(NewtonAdapter.isInitialized()).toBe(false);
    });
});