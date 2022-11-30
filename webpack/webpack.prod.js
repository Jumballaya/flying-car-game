const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(commonConfiguration, {
  mode: 'production',
  output: {
    publicPath: '/flying-car-game/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      process: {
        env: {
          PUBLIC_PATH: JSON.stringify('/flying-car-game/'),
        },
      },
    }),
  ],
});
