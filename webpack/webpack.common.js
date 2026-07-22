'use strict';

const Path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dest = Path.join(__dirname, '../dist');
const synergyLibs = Path.resolve(__dirname, '../libs/IzendaSynergy');

module.exports = {
  output: {
    clean: true
  },
  externals: {
    jquery: 'jQuery',
    IzendaSynergy: 'IzendaSynergy'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html')
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: Path.join(synergyLibs, 'izenda-ui.css'), to: 'IzendaSynergy/izenda-ui.css' },
        { from: Path.join(synergyLibs, 'izenda_locales.js'), to: 'IzendaSynergy/izenda_locales.js' },
        { from: Path.join(synergyLibs, 'izenda_vendors.js'), to: 'IzendaSynergy/izenda_vendors.js' },
        { from: Path.join(synergyLibs, 'izenda_ui.js'), to: 'IzendaSynergy/izenda_ui.js' },
        { from: Path.join(synergyLibs, 'izenda_ui.js.map'), to: 'IzendaSynergy/izenda_ui.js.map' },
        { from: Path.join(synergyLibs, 'izenda_vendors.js.map'), to: 'IzendaSynergy/izenda_vendors.js.map' },
        { from: Path.join(synergyLibs, 'assets'), to: 'IzendaSynergy/assets' },
        { from: Path.join(synergyLibs, 'plugins'), to: 'IzendaSynergy/plugins' },
        { from: Path.join(synergyLibs, 'skins'), to: 'IzendaSynergy/skins' },
        { from: Path.join(synergyLibs, 'themes'), to: 'IzendaSynergy/themes' }
      ]
    })
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name][ext]'
        }
      }
    ]
  }
};
