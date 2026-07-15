'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const Path = require('path');

const dest = Path.join(__dirname, '../dist');

module.exports = merge(common, {
  entry: [Path.resolve(__dirname, '../src/index')],
  output: {
    path: dest,
    filename: 'bundle.[hash].js',
    publicPath: '/'
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
  watchOptions: {
    ignored: /node_modules/
  },
  devServer: {
    static: {
      directory: dest
    },
    historyApiFallback: true,
    hot: true,
    liveReload: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: Path.resolve(__dirname, '../public'), to: 'public' }]
    }),
    new Webpack.HotModuleReplacementPlugin(),
    new ESLintWebpackPlugin({
      context: Path.resolve(__dirname, '../src'),
      emitWarning: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/i,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { api: 'modern' } }
        ]
      }
    ]
  }
});
