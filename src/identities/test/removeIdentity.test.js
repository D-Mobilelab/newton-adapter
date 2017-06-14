var Bluebus = require('bluebus');

var removeIdentityModule = require('../removeIdentity');
var NewtonMock = require('../../NewtonMock');
var Identity = require('./helpers/helpers').Identity;
var noop = require('./helpers/helpers').noop;

describe('identity/removeIdentity', function() {

    var newtonMockInstance, 
        removeIdentity;
    beforeEach(function() {
        newtonMockInstance = NewtonMock.getSharedInstanceWithConfig();
        /** this returns the real function with dependencies injected */
        removeIdentity = removeIdentityModule({
                Global: {
                    logger: { 
                        debug: noop,
                        log: noop,
                        info: noop,
                        warn: noop,
                        error: noop
                    },
                    newtonInstance: newtonMockInstance,
                },
                Bluebus: Bluebus
        });
    });

    afterEach(function() {
        NewtonMock._reset();
        Bluebus.cleanAll();
    });

    
    it('should reject on error', function(done) {
        /** mock getIdentities */
        newtonMockInstance.getIdentities = function(fn){
            fn(new Error('IdentError'));
        };

        removeIdentity({ type: 'oauth' })
            .then(done.fail)
            .catch(function(err) {
                expect(err).toBeDefined();
                done();
            });
        Bluebus.trigger('login');
    });

    it('should reject if there\'s only one identity', function(done) {
        /** mock getIdentities */
        newtonMockInstance.getIdentities = function(fn){
            fn(null, [new Identity('oauth')]);
        };

        removeIdentity({ type: 'oauth' })
            .then(done.fail)
            .catch(function(err) {
                expect(err).toBeDefined();
                done();
            });
        Bluebus.trigger('login');
    });

    it('should remove the identity', function(done) {
        /** mock getIdentities */
        newtonMockInstance.getIdentities = function(fn) {
            fn(null, [new Identity('oauth'), new Identity('msisdn')]);
        };

        removeIdentity({ type: 'oauth' })
            .then(function(result) {
                expect(result).toEqual(true);
                done();
            }).catch(done.fail);
            
        Bluebus.trigger('login');
    });

    it('should reject if identity.delete throws an error', function(done) {
        
        /** mock delete identity method */
        var identity = new Identity('oauth');
        identity.delete = function(fn){
            fn(new Error('Error while deleting'));
        }

        newtonMockInstance.getIdentities = function(fn) {
            fn(null, [identity, new Identity('msisdn')]);
        };

        removeIdentity({ type: 'oauth' })
            .then(function(result) {
                done.fail(result);
            }).catch(function(err) {
                expect(err.message).toEqual('Error while deleting');
                done();
            });
            
        Bluebus.trigger('login');
    });
});