var path = require('path');

// Karma configuration
module.exports = function(config) {
    config.set({

        basePath: '.',

        frameworks: ['jasmine'],
        
        files: ['test/spec/**/*.js'],

        browsers: ['PhantomJS'],

        reporters: ['spec', 'coverage-istanbul'],

        preprocessors: {
            'test/spec/**/*.js': ['webpack']
        },

        coverageIstanbulReporter: {
            reports: ['text-summary', 'lcov'],
            fixWebpackSourcePaths: true,
            type: 'lcov',
            dir: 'test/'
        },

        webpack: {
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        include: path.resolve('src/'),
                        loader: 'istanbul-instrumenter-loader'
                    }
                ]
            }
        },

        webpackMiddleware: {
            stats: 'errors-only'
        },

        singleRun: true
    });
};