var path = require('path');

// Karma configuration
module.exports = function(config) {
    config.set({

        basePath: '.',

        frameworks: ['jasmine'],

        files: [
            // PhantomJS does not have native support for promises....
            'node_modules/promise-polyfill/dist/polyfill.js',
            'src/**/*.test.js'
        ],

        browsers: ['PhantomJS'],

        reporters: ['spec', 'coverage-istanbul'],

        preprocessors: {
            'src/**/*.test.js': ['webpack']
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
                        exclude: /\.test\.js$/,
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