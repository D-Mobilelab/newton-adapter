var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var calls, NewtonMock;

describe('login/finalizeLoginFlow', function(){
    beforeEach(function(){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

    it('with init, return true and call finalizeLoginFlow', function(done){
        var callback = function(){};
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            var result = NewtonAdapter.finalizeLoginFlow(callback);
            expect(result).toBe(true);
            expect(NewtonMock.finalizeLoginFlow).toHaveBeenCalledWith(callback);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });   
    }); 

    it('without init, return false and don\'t call finalizeLoginFlow', function(){
        var result = NewtonAdapter.finalizeLoginFlow();
        expect(result).toBe(false);
        expect(NewtonMock.finalizeLoginFlow).not.toHaveBeenCalled();
    }); 
});