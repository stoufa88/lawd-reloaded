
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const baseConfig = require('./webpack.config.base');

const config = Object.create(baseConfig);

config.devtool = 'source-map';

config.entry = 'app/renderer';

config.output.publicPath = 'app/out/';

config.module.loaders.push({
  test: /\.global\.scss$/,
  loader: ExtractTextPlugin.extract(
    'style-loader',
    'css-loader!sass-loader'
  )
}, {
  test: /^((?!\.global).)*\.scss$/,
  loader: ExtractTextPlugin.extract(
    'style-loader',
    'css-loader!sass-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
  )
});

config.plugins.push(
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    __DEV__: false,
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  // new webpack.optimize.UglifyJsPlugin({
  //   compressor: {
  //     screw_ie8: true,
  //     warnings: false
  //   }
  // }),
  new ExtractTextPlugin('style.css', { allChunks: true }),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
  new webpack.ProvidePlugin({
    "window.Tether": "tether",
    Tether: 'tether'
  })
);

config.target = webpackTargetElectronRenderer(config);

module.exports = config;
