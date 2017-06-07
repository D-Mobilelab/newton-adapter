/* global Newton */
var Promise = require('promise-polyfill');
var Bluebus = require('bluebus');
var Global = require('../global');

/**
* @ngdoc function
* @name rankContent
* @methodOf NewtonAdapter
*
* @description Performs Newton content ranking<br>
* <b>This method is executed after login (waitLogin:true) or after init (false)</b>
* <br><b>Newton version 1 don't support this feature</b>
*
* @param {Object} options configuration object
* @param {string} options.contentId unique identifier of the content
* @param {string} options.scope type of action performed on the content
* @param {number} [options.score=1] the score associated to the content
*
* @return {Promise} promise will be resolved when ranking is completed, rejected if failed
*
* @example
* <pre>
*   NewtonAdapter.rankContent({
*       contentId: '123456777',
*       scope: 'social',
*       score: 4
*   }).then(function(){
*       console.log('rankContent success');
*   }).catch(function(err){
*       console.log('rankContent failed', err);
*   });
* </pre>
*/
module.exports = function(options){
    return new Promise(function(resolve, reject){
        Bluebus.bind('login', function(){
            var score = options.score ? options.score : 1;
            if(Global.newtonversion === 1){
                reject('Newton v.1 not support rank content');
                Global.logger.error('NewtonAdapter', 'rankContent', 'Newton v.1 not support rank content');
            } else {
                if(options.contentId && options.scope){
                    Global.newtonInstance.rankContent(options.contentId, options.scope, score);
                    resolve();
                    Global.logger.log('NewtonAdapter', 'rankContent', options);
                } else {
                    reject('rankContent requires scope and contentId');
                    Global.logger.error('NewtonAdapter', 'rankContent', 'rankContent requires scope and contentId');
                }
            }
        });
    });
};