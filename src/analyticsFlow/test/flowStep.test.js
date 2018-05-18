var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var NewtonMock;

describe('analytcsFlow/flowStep', function(){
    beforeEach(function(done){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;

        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.flowBegin({name: 'testFlow', properties: {}}).then(function(){ return; }).catch(function(err){console.log(err);})
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
        NewtonAdapter.flowCancel({name: 'closeFlow'}).then(function(){return}).catch(function(err){console.log(err)});
    });

    it('flowStep - call Newton.flowStep without anything', function(done){
        NewtonAdapter.flowStep().then(function(){
            done.fail();
        }).catch(function(){
            expect(NewtonMock.flowStep).not.toHaveBeenCalled();           
            done();
        });
    });

    it('flowStep - call Newton.flowStep without properties', function(done){
        NewtonAdapter.flowStep({name: 'testFlow1'}).then(function(){
            expect(NewtonMock.flowStep).toHaveBeenCalledWith('testFlow1', {});                       
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('flowStep - call Newton.flowStep with properties', function(done){
        NewtonAdapter.flowStep({name: 'testFlow2', properties: {test: 1}}).then(function(){
            expect(NewtonMock.flowStep).toHaveBeenCalledWith('testFlow2', {test: 1});                       
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});

describe('analytcsFlow/flowStep failure', function(){
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

    it('flowStep - call Newton.flowStep without flowBegin', function(done){
        NewtonAdapter.flowStep({name: 'testFlow1', properties: {test: 1}}).then(function(){
            done.fail();
        }).catch(function(reason){
            expect(NewtonMock.flowStep).not.toHaveBeenCalled();                                   
            done();
        });
    });

});