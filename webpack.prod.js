const { merge } = require('webpack-merge');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

const buildCommonConfig = require('./webpack.common');

const buildProdConfig = (envVars = {}) => {
  const prodConfig = {
    mode: 'production',
    output: {
      path: path.join(__dirname, '/dist/latest'),
      filename: '[name].[contenthash].js',
      publicPath: '/',
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: './src/index.html',
      }),
      new CompressionPlugin(),
    ],
  };
  return merge(buildCommonConfig(envVars), prodConfig);
};

module.exports = buildProdConfig;
