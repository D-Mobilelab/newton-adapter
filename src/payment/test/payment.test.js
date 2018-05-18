var NewtonAdapter = require('../../main');
var Mock = require('../../../test/mock');
var getOfferFor = require('../index').getOfferFor;
var addSerializedPayment = require('../index').addSerializedPayment;
var NewtonMock;

describe('Payment', function(){ 
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
    })


    it('getOfferFor', function(done){
        getOfferFor('test_subscription', 'googlePlay')
            .then(function(offerId) {                
                expect(offerId).toEqual('offerIdMock');
                done();
            })
            .catch(done.fail)
    });

    it('addSerializedPayment', function(done){
        addSerializedPayment('serializedPayment')
            .then(function(){
                done();
            })
            .catch(done.fail);        
    });
});