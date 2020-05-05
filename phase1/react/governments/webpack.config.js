let path = require('path');
let webpack = require('webpack');

'use strict';

module.exports = {
    entry: ['babel-polyfill', './client/index.js'],
    output: {
        path: path.join(__dirname, 'client'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['@babel/env', '@babel/react']
            }
        },
        {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    }
}
