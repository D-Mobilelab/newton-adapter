var trackEvent = require('./trackEvent');

/**
* @ngdoc function
* @name trackPageview
* @methodOf NewtonAdapter
*
* @description Performs Newton pageview tracking<br>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
*
* @param {Object} options configuration object
* @param {Object} options.properties properties of the pageview
* @param {string} [options.properties.url=window.location.href] url of pageview
*
* @return {Promise} promise will be resolved when tracking is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.trackPageview({
*       properties: {
*           url: 'http://www.google.it',
*           title: 'Game',
*           hello: 'World'
*       }
*   }).then(function(){
*       console.log('trackPageview success');
*   }).catch(function(err){
*       console.log('trackPageview failed', err);
*   });
* </pre>
*/
module.exports = function(options){
    var eventParams = options || {};
    eventParams.name = 'pageview';
    if(!eventParams.properties){
        eventParams.properties = {};
    }
    if(!eventParams.properties.url){
        eventParams.properties.url = window.location.href;
    }
    return trackEvent(eventParams);
};