'use strict';

const { HotModuleReplacementPlugin } = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');


const webpackDevConfig = {};
webpackDevConfig.module = {};
webpackDevConfig.mode = 'development';
webpackDevConfig.devtool = 'inline-source-map';

webpackDevConfig.devServer = {
  contentBase: './build',
  open: true, // opens a new tab in our default browser
  hot: true, // hot reloads our changes every time we save
  historyApiFallback: true,
};

webpackDevConfig.plugins = [
  new HotModuleReplacementPlugin(),
];

webpackDevConfig.module.rules = [
  {
    test: /\.scss$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true, // maps css lines in inspector back to actual scss file
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },
];

module.exports = merge(commonConfig, webpackDevConfig);
