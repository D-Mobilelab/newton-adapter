var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var NewtonMock;

describe('analytcsFlow/flowCancel failure', function(){
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

    it('flowCancel - call Newton.flowCancel without flowBegin', function(done){
        NewtonAdapter.flowCancel().then(function(){
            done.fail();
        }).catch(function(){
            expect(NewtonMock.flowCancel).not.toHaveBeenCalled();           
            done();
        });
    });
});

describe('analytcsFlow/flowCancel', function(){
    beforeEach(function(done){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;

        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.flowBegin({ name: 'testFlow', properties: {} }).then(function(){ }).catch(function(err){ console.log(err); })            
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    it('flowCancel - call Newton.flowCancel without anything after flowBegin', function(done){
        NewtonAdapter.flowCancel().then(function(){
            done.fail();
        }).catch(function(){
            expect(NewtonMock.flowCancel).not.toHaveBeenCalled();

            NewtonAdapter.flowCancel({name: 'closingFlow'}).then(function(){
                expect(NewtonMock.flowCancel).toHaveBeenCalledWith('closingFlow', {})
                done();
            }).catch(function(reason){
                done.fail(reason);
            })           
        });
    });

    it('flowCancel - call Newton.flowCancel after step with properties', function(done){
        NewtonAdapter.flowStep({ name: 'testFlow1' }).then(function(){
            NewtonAdapter.flowCancel({ name: 'closingFlow', properties: { skipped: 1 } }).then(function(){
                expect(NewtonMock.flowCancel).toHaveBeenCalledWith('closingFlow', { skipped: 1 });
                done();
            }).catch(function(reason){
                done.fail(reason)
            });
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});