var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var NewtonMock;

describe('analytcsFlow/flowSucceed failure', function(){
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

    it('flowSucceed - call Newton.flowSucceed without flowBegin', function(done){
        NewtonAdapter.flowSucceed().then(function(){
            done.fail();
        }).catch(function(){
            expect(NewtonMock.flowSucceed).not.toHaveBeenCalled();           
            done();
        });
    });
});

describe('analytcsFlow/flowSucceed', function(){
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

    it('flowSucceed - call Newton.flowSucceed without anything after flowBegin', function(done){
        NewtonAdapter.flowSucceed().then(function(){
            done.fail();
        }).catch(function(){
            expect(NewtonMock.flowSucceed).not.toHaveBeenCalled();

            NewtonAdapter.flowSucceed({name: 'closingFlow'}).then(function(){
                expect(NewtonMock.flowSucceed).toHaveBeenCalledWith('closingFlow', {})
                done();
            }).catch(function(reason){
                done.fail(reason);
            })           
        });
    });

    it('flowSucceed - call Newton.flowSucceed after step with properties', function(done){
        NewtonAdapter.flowStep({ name: 'testFlow1' }).then(function(){
            NewtonAdapter.flowSucceed({ name: 'closingFlow', properties: { skipped: 1 } }).then(function(){
                expect(NewtonMock.flowSucceed).toHaveBeenCalledWith('closingFlow', { skipped: 1 });
                done();
            }).catch(function(reason){
                done.fail(reason)
            });
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});