const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const Webpack = require('webpack');
const Path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dest = Path.join(__dirname, '../dist');

module.exports = merge(common, {
  entry: [Path.resolve(__dirname, './polyfills'), Path.resolve(__dirname, '../src/visualization.js')],
  output: {
    path: dest,
    filename: 'izenda_visualizations.js'
  },
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-only',
  optimization: {
    minimize: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new ExtractTextPlugin({ filename: 'izenda_visualizations.css' }),
    // compiling mode “scope hoisting”
    new Webpack.optimize.ModuleConcatenationPlugin()
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      },
      {
        test: /\.s?css/i,
        use: ExtractTextPlugin.extract(['css-loader?sourceMap=true&minimize=true', 'sass-loader'])
      }
    ]
  }
});
