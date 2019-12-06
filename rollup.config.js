import path from 'path';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';

function onwarn(warning) {
    throw Error(typeof warning === 'string' ? warning : warning.message);
}

const input = 'src/main.js';

const extensions = ['.js'];

const commonPlugins = [
    nodeResolve({ extensions }),
    commonjs({
        ignoreGlobal: true,
    }),
    babel({
        extensions,
        exclude: /node_modules/,
        runtimeHelpers: true,
        configFile: path.resolve(process.cwd(), 'babel.config.js'),
    }),
    nodeGlobals(),
];

export default [
    {
        input,
        onwarn,
        output: {
            format: 'umd',
            file: 'umd/index.js',
            name: 'NewtonAdapter',
        },
        plugins: [
            ...commonPlugins,
            replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
        ],
    },
    {
        input,
        onwarn,
        output: {
            format: 'umd',
            file: 'umd/index.min.js',
            name: 'NewtonAdapter',
        },
        plugins: [
            ...commonPlugins,
            replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
            terser(),
        ],
    },
];
