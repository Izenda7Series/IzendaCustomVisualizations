'use strict';

const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const dest = Path.join(__dirname, '../dist');

module.exports = {
  entry: [Path.resolve(__dirname, './polyfills'), Path.resolve(__dirname, '../src/index')],
  output: {
    path: dest,
    filename: 'bundle.[hash].js'
  },
  plugins: [
    new CleanWebpackPlugin([dest]),
    new CopyWebpackPlugin([{ from: Path.resolve(__dirname, '../public'), to: 'public' }]),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html')
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'jquery',
          entry: 'https://unpkg.com/jquery@3.2.1/dist/jquery.min.js',
          global: 'jQuery'
        },
        {
          module: 'IzendaSynergy',
          entry: [
            {
              path: 'izenda-ui.css',
              type: 'css',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            },
            {
              path: 'izenda_common.js',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            },
            {
              path: 'izenda_locales.js',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            },
            {
              path: 'izenda_vendors.js',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            },
            {
              path: 'izenda_ui.js',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            }
          ],
          supplements: [
            {
              path: 'assets/',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            },
            {
              path: 'plugins/',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            },
            {
              path: 'skins/',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            },
            {
              path: 'themes/',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            },
            {
              path: 'izenda_ui.js.map',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            },
            {
              path: 'izenda_vendors.js.map',
              cwpPatternConfig: {
                context: Path.resolve(__dirname, '../libs')
              }
            }
          ],
          global: 'IzendaSynergy'
        }
      ]
    }),
    new Webpack.HotModuleReplacementPlugin()
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
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      }
    ]
  }
};
