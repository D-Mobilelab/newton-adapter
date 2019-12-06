var Bluebus = require('bluebus');

/**
* @ngdoc function
* @name isInitialized
* @methodOf NewtonAdapter
*
* @description Check if NewtonAdapter is initialized.
* <br><b>Synchronous call, don't wait init</b>
*
* @return {boolean} true if init has been called, else false
*
* @example
* <pre>
* NewtonAdapter.isInitialized();
* </pre>
*/

module.exports = function(){
    return Bluebus.isTriggered('init');
};