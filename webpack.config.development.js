
const webpack = require('webpack');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const baseConfig = require('./webpack.config.base');

const config = Object.create(baseConfig);

config.debug = true;

config.devtool = 'cheap-module-eval-source-map';

config.entry = [
  'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
  './app/renderer/index'
];

config.output.publicPath = 'http://localhost:3000/dist/';

config.module.loaders.push({
  test: /\.global\.scss$/,
  loaders: [
    'style-loader',
    'css-loader',
    'sass-loader'
  ]
}, {
  test: /^((?!\.global).)*\.scss$/,
  loaders: [
    'style-loader',
    'css-loader',
    'sass-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
  ]
});

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    __DEV__: true,
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  }),
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
