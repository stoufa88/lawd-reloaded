const path = require('path');

module.exports = {
  module: {
    noParse: ['ws'],
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'url-loader?importLoaders=1&limit=150000' },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'app/renderer'),
        loaders: ['babel-loader']
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve('.'),
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [

  ],
  externals: [
		['ws']
    // put your node 3rd party libraries which can't be built with webpack here
    // (mysql, mongodb, and so on..)
  ]
};
