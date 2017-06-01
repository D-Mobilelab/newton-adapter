/* global Newton Newton:true */
/* eslint-env jasmine */
var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var NewtonMock;

describe('IDENTITY', function(){
    beforeEach(function(done){
        Mock.boostrap();       
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;

        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        }).then(function(){
            NewtonAdapter.login({
                logged: true,
                type: 'custom',
                userId: 'userId',
                userProperties: { id: 'id' }
            }).then(function(){
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        }).catch(function(reason){
            done.fail(reason);
        });
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

    it('ADD IDENTITY', function(done){
        var provider = 'Facebook';
        var accessToken = '1234567890abcedf';
        NewtonAdapter.addIdentity({
            type: 'oauth',
            provider: provider,
            access_token: accessToken
        }).then(function(){
            expect(NewtonMock.getIdentityManager).toHaveBeenCalled();
            expect(NewtonMock.getIdentityBuilder).toHaveBeenCalled();
            expect(NewtonMock.setOAuthProvider).toHaveBeenCalledWith(provider);
            expect(NewtonMock.setAccessToken).toHaveBeenCalledWith(accessToken);
            expect(NewtonMock.getAddOAuthIdentityFlow).toHaveBeenCalled();
            expect(NewtonMock.startAddIdentityFlow).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});