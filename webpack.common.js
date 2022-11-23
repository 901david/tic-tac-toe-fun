const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const buildCommonConfig = (envVars = {}) => {
  return {
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: [/\.jsx?$/, /\.mjs$/],
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }],
              ],
            },
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src', 'components'),
        src: path.resolve(__dirname, 'src'),
        utils: path.resolve(__dirname, 'src', 'utils'),
      },
    },
    plugins: [
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        failOnError: true,
      }),
    ],
  };
};

module.exports = buildCommonConfig;
