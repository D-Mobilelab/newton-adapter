var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var calls, NewtonMock;

describe('login/isUserLogged', function(){
    beforeEach(function(){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

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