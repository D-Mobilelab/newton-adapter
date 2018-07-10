var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var calls, NewtonMock;

describe('user/getSessionId', function(){
    beforeEach(function(){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

    it('getSessionId call relative Newton method', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.getSessionId();
            expect(NewtonMock.getSessionId).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('return false if you have not called init() yet', function(){
        var returnFlag = NewtonAdapter.getSessionId();
        expect(NewtonMock.getSessionId).not.toHaveBeenCalled();
        expect(returnFlag).toBe(false);
    });
});