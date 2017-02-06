// Karma configuration
module.exports = function(config) {
    config.set({

        basePath: '.',

        frameworks: ['jasmine'],
        
        files: [
            'test/*.test.js'
        ],

        browsers: [
            'PhantomJS'
        ],

        reporters: [
            'spec',
            'coverage'
        ],

        preprocessors: {
            'test/*.test.js': ['webpack'],
            'src/*.js': ['coverage']
        },

        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage/'
        },

        webpack: {},

        webpackMiddleware: {
            stats: 'errors-only'
        }
    });
};