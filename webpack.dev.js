const { merge } = require('webpack-merge');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const buildCommonConfig = require('./webpack.common');

const buildDevConfig = (envVars = {}) => {
  const devConfig = {
    mode: 'development',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    devServer: {
      hot: true,
      port: 3000,
      open: true,
      historyApiFallback: true,
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: './src/index.html',
      }),
    ],
  };

  return merge(buildCommonConfig(envVars), devConfig);
};

module.exports = buildDevConfig;
