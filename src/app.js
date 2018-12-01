// built-in modules
const path = require('path');

// third-party modules
const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

// local moudles
const imageRouter = require('./routes/image');
const feedbackRouter = require('./routes/feedback');
const cronJob = require('./cron/index');

const app = express();

console.log(`app is running under as ${process.env.NODE_ENV} mode.`);

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackConfig = require('../webpack.dev');
  const webpackCompiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(webpackCompiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    })
  );

  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

const SERVER_PORT = config.get('server_port');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(imageRouter);
app.use(feedbackRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/404.html'));
});

mongoose.set('debug', true);

mongoose
  .connect(
    config.get('db_server'),
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log('db connected');
    app.listen(SERVER_PORT, () => {
      console.log(`server is listening on port ${SERVER_PORT}`);
      cronJob.start();
    });
  })
  .catch(error => {
    console.error('db connection error', error);
  });
