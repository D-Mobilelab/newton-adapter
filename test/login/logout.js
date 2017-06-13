var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var NewtonMock;

describe('login/logout', function(){
    var userId = '111222333444';
    var userProperties = {
        msisdn: '+39123456789'
    };
    
    beforeEach(function(done){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;

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

    
    it('as logged', function(done){
        NewtonAdapter.login({
            logged: true,
            type: 'external',
            userId: userId,
            userProperties: userProperties
        }).then(function(){
            NewtonAdapter.logout().then(function(){
                expect(NewtonMock.userLogout).toHaveBeenCalled();   
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        }).catch(function(reason){
            done.fail(reason);
        });   
    }); 

    it('as unlogged', function(done){
        NewtonAdapter.logout().then(function(){
            expect(NewtonMock.userLogout).not.toHaveBeenCalled();   
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});