window.Newton = require('./NewtonMock');
var NewtonAdapter = require('../src/main');

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