/* global Newton Newton:true */
/* eslint-env jasmine */
var NewtonAdapter = require('../../src/main');
var Mock = require('../mock');
var NewtonMock;

describe('OTHERS', function(){
    beforeEach(function(){
        Mock.boostrap();        
        NewtonMock = Mock.NewtonMock;
        Newton = Mock.Newton;
    });

    afterEach(function(){
        NewtonAdapter.resetForTest();
    });

    describe('IS USER LOGGED', function(){
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

    describe('IS INITIALIZED', function(){
        it('return true if you have called init() before', function(done){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: false
            }).then(function(){
                expect(NewtonAdapter.isInitialized()).toBe(true);
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('return false if you have not called init() yet', function(){
            expect(NewtonAdapter.isInitialized()).toBe(false);
        });
    });

    describe('GET USER TOKEN', function(){
        it('getUserToken call relative Newton method', function(done){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: false
            }).then(function(){
                NewtonAdapter.getUserToken();
                expect(NewtonMock.getUserToken).toHaveBeenCalled();
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('return false if you have not called init() yet', function(){
            var returnFlag = NewtonAdapter.getUserToken();
            expect(NewtonMock.getUserToken).not.toHaveBeenCalled();
            expect(returnFlag).toBe(false);
        });
    });

    describe('SET USER STATE CHANGE LISTENER', function(){
        it('setUserStateChangeListener call relative Newton method and call callback', function(done){
            NewtonAdapter.init({
                secretId: '<local_host>',
                enable: true,
                waitLogin: false
            }).then(function(){
                var mock = { callback: function(){} };
                spyOn(mock, 'callback').and.callThrough();
                NewtonAdapter.setUserStateChangeListener(mock.callback);
                expect(NewtonMock.setUserStateChangeListener).toHaveBeenCalled();
                expect(mock.callback).toHaveBeenCalled();
                done();
            }).catch(function(reason){
                done.fail(reason);
            });
        });

        it('return false if you have not called init() yet', function(){
            var returnFlag = NewtonAdapter.setUserStateChangeListener();
            expect(NewtonMock.setUserStateChangeListener).not.toHaveBeenCalled();
            expect(returnFlag).toBe(false);
        });
    });

    describe('FINALIZELOGINFLOW', function(){
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
});