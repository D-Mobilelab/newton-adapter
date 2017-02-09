// Karma configuration
module.exports = function(config) {
    config.set({

        basePath: '.',

        frameworks: ['jasmine'],
        
        files: [
            'test/spec/*.js'
        ],

        browsers: [
            'PhantomJS',
        ],

        reporters: [
            'spec',
            'coverage'
        ],

        preprocessors: {
            'test/spec/*.js': ['webpack'],
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