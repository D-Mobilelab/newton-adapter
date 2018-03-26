var Promise = require('promise-polyfill');
/**
 * Promisify the node js style callbacks
 * @param {Function} func
 * @returns {Function} 
 */
module.exports = function promisify(func) {
    return function promisified() {
        var args = [].slice.call(arguments);    
        return new Promise(function(resolve, reject) {
            var callback = function() {
                var realArgs = [].slice.call(arguments);
                if(realArgs[0]) {
                    reject(realArgs[0]);
                    return;
                }
                realArgs.shift();
                resolve.apply(null, realArgs);
            };
            args[args.length] = callback;
            func.apply(this, args);
        });
    };
};
