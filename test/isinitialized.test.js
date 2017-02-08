window.Newton = require('./NewtonMock');
var NewtonAdapter = require('../src/main');


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