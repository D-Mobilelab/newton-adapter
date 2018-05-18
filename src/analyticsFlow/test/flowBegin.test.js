var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var NewtonMock;

describe('analytcsFlow/flowBegin', function(){
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
        NewtonAdapter.flowCancel({ name: 'closeFlow' }).then(function(){ }).catch(function(err){ console.log(err); });
    });

    it('flowBegin - call Newton.flowBegin without anything', function(done){
        NewtonAdapter.flowBegin().then(function(){
            done.fail();
        }).catch(function(){
            expect(NewtonMock.flowBegin).not.toHaveBeenCalled();           
            done();
        });
    });

    it('flowBegin - call Newton.flowBegin without properties', function(done){
        NewtonAdapter.flowBegin({ name: 'testFlow' }).then(function(){
            expect(NewtonMock.flowBegin).toHaveBeenCalledWith('testFlow', {});                       
            done();
        }).catch(function(reason){
            done().fail();
        });
    });

    it('flowBegin - call Newton.flowBegin with properties', function(done){
        NewtonAdapter.flowBegin({ name: 'testFlow', properties: { device: 'Android' } }).then(function(){
            expect(NewtonMock.flowBegin).toHaveBeenCalledWith('testFlow', { device: 'Android' });                       
            done();
        }).catch(function(reason){
            done().fail(reason);
        });
    });

    it('flowBegin - call Newton.flowBegin twice during a flow', function(done){
        NewtonAdapter.flowBegin({ name: 'testFlow', properties: { device: 'Android' } }).then(function(){
            NewtonAdapter.flowBegin({ name: 'testFlowFail', properties: {} }).then(function(){
                done.fail();
            }).catch(function(){
                expect(NewtonMock.flowBegin).toHaveBeenCalledWith('testFlow', { device: 'Android' });
                expect(NewtonMock.flowBegin).not.toHaveBeenCalledWith('testFlowFail', { });
                done();
            });
        }).catch(function(reason){
            done().fail(reason);
        });
    });
});