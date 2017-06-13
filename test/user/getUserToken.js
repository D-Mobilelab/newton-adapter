var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var calls, NewtonMock;

describe('login/getUserToken', function(){
    beforeEach(function(){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

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