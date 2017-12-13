var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var NewtonMock;

describe('tracking/setLogView', function(){
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

    it('call Newton.setLogViewInfo with parameters', function(done){
        var properties = {
            endpoint: 'endpoint-xxx',
            uid: 'uid-xxx',
            label: 'label-xxx',
            pid: 'pid-xxx'
        };
        NewtonAdapter.setLogView(properties).then(function(){
            expect(NewtonMock.setLogViewInfo).toHaveBeenCalledWith(properties);
            done();
        }).catch(function(reason){
            done.fail(reason);
        });        
    });
});