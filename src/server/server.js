// Path
const path = require('path')

// Config
var config = require(path.resolve(__dirname, '../../config'));

// Express
const express = require('express');
const app = express();

// Webpack
const webpack = require('webpack');
const webpackConfig = require(path.resolve(__dirname, './webpack.config.js'));
const webpackDevMiddleware = require('webpack-dev-middleware');
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler));

// Public Assets
app.use(express.static(path.resolve(__dirname, './public')));

// Client
app.use(express.static(path.resolve(__dirname, '../client')));
app.get('/*', function response(req, res) {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

// Initialize
const server = app.listen(config.port, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});
