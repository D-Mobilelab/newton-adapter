var path = require('path');

// Karma configuration
module.exports = function(config) {
    config.set({

        basePath: '.',

        frameworks: ['jasmine'],
        
        files: ['test/**/*.js'],

        browsers: ['PhantomJS'],

        reporters: ['spec', 'coverage-istanbul'],

        preprocessors: {
            'test/**/*.js': ['webpack']
        },

        coverageIstanbulReporter: {
            reports: ['text-summary', 'lcov'],
            fixWebpackSourcePaths: true,
            type: 'lcov',
            dir: 'test/report/'
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