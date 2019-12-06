const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const commonPaths = {
    root: path.resolve(__dirname),
    outputPath: path.resolve(__dirname, 'dist'),
    entryPath: path.resolve(__dirname, 'src/index.js'),
    browserEntryPath: path.resolve(__dirname, 'src/index.browser.js'),
    typingsFromPath: path.resolve(__dirname, 'src/index.d.ts'),
    typingsToPath: path.resolve(__dirname, 'dist/index.d.ts'),
    examplePath: {
        html: path.resolve(__dirname, 'examples/index.html'),
        js: path.resolve(__dirname, 'examples/index.js'),
    },
    chunkFilename: '[name].chunk.[chunkhash:8].js',
    cssFolder: 'css',
    jsFolder: 'js',
};

module.exports = {
    entry: commonPaths.examplePath.js,
    mode: 'development',
    output: {
        filename: '[name].js',
        path: commonPaths.outputPath,
        chunkFilename: '[name].js',
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /(node_modules)/,
                options: {
                    emitWarning: process.env.NODE_ENV !== 'production',
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
            },
        ],
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.css', '.scss'],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: commonPaths.examplePath.html,
            filename: './index.html',
        }),
    ],
    devServer: {
        port: 3001,
        compress: true,
    },
    devtool: 'source-map',
};
