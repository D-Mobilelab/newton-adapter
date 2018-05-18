var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var calls, NewtonMock;

describe('login/setUserStateChangeListener', function(){
    beforeEach(function(){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

    it('setUserStateChangeListener call relative Newton method and call callback', function(done){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            var mock = { onLoginStateChange: function(){} };
            spyOn(mock, 'onLoginStateChange').and.callThrough();
            NewtonAdapter.setUserStateChangeListener(mock);
            expect(NewtonMock.setUserStateChangeListener).toHaveBeenCalled();
            expect(mock.onLoginStateChange).toHaveBeenCalled();
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