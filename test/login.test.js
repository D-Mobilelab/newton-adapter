window.Newton = require('./NewtonMock');
var NewtonAdapter = require('../src/main');
/* LOGIN */
describe('login - ', function(){
    var userId = '111222333444';
    var userProperties = {
        msisdn: '+39123456789'
    };
    var callbackMethod = function(){};

    beforeEach(function(){
        NewtonAdapter.init({
            secretId: '<local_host>',
            enable: true,
            waitLogin: false
        });
    });

    it('external login', function(done){
        NewtonAdapter.login({
            logged: true,
            userId: userId,
            userProperties: userProperties,
            callback: callbackMethod,
            type: 'external'
        }).then(function(){
            expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
            expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
            // expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalledWith(callbackMethod.call();
            expect(NewtonMock.setExternalID).toHaveBeenCalledWith(userId);
            expect(NewtonMock.getExternalLoginFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });        
    });

    it('custom login', function(done){
        NewtonAdapter.login({
            logged: true,
            userId: userId,
            userProperties: userProperties,
            callback: callbackMethod
        }).then(function(){
            expect(NewtonMock.getLoginBuilder).toHaveBeenCalled();
            expect(NewtonMock.setCustomData).toHaveBeenCalledWith(userProperties);
            // expect(NewtonMock.setOnFlowCompleteCallback).toHaveBeenCalledWith(callbackMethod.call();
            expect(NewtonMock.setCustomID).toHaveBeenCalledWith(userId);
            expect(NewtonMock.getCustomLoginFlow).toHaveBeenCalled();
            expect(NewtonMock.startLoginFlow).toHaveBeenCalled();
            done();
        }).catch(function(reason){
            done.fail(reason);
        });
    });
});

/* IS LOGGED */

describe('isUserLogged -', function(){
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