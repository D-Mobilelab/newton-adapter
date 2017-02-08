window.NewtonMock = require('./NewtonMock');
var NewtonAdapter = require('../src/main');

/* GET USER TOKEN */
describe('getUserToken -', function(){

    beforeEach(function(done){
        NewtonMock.getUserToken = jasmine.createSpy('getUserTokenSpy');
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            return done();
        });
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
        window.NewtonMock.resetCalls();
    });

    fit('getUserToken call relative Newton method', function(){
        NewtonAdapter.getUserToken();
        expect(NewtonMock.getUserToken).toHaveBeenCalled();          
    });

    fit('return false if you have not called init() yet', function(){        
        expect(NewtonMock.getUserToken).not.toHaveBeenCalled();
        expect(NewtonAdapter.getUserToken()).toEqual(false);
    });
});