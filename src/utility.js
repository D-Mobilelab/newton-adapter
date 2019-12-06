/* global Newton */
var Global = require('./global');

var Utility = {
    createSimpleObject: function(object){
        try {
            var newObject = object || {};
            return Newton.SimpleObject.fromJSONObject(newObject);
        } catch(err){
            Global.logger.warn('NewtonAdapter', 'Newton.SimpleObject.fromJSONObject is failed', err);
            return Newton.SimpleObject.fromJSONObject({});
        }
    }
};

module.exports = Utility;