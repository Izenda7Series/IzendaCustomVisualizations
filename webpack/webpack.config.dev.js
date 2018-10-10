'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Path = require('path');

const dest = Path.join(__dirname, '../dist');

module.exports = merge(common, {
  entry: [Path.resolve(__dirname, './polyfills'), Path.resolve(__dirname, '../src/index')],
  output: {
    path: dest,
    filename: 'bundle.[hash].js'
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: dest,
    inline: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new CopyWebpackPlugin([{ from: Path.resolve(__dirname, '../public'), to: 'public' }]),
    new Webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true
        }
      },
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader?sourceMap=true', 'sass-loader']
      }
    ]
  }
});
