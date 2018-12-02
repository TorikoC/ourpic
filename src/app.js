// built-in modules
const path = require('path');
const fs = require('fs');
const http = require('http');
const compression = require('compression');
const spdy = require('spdy');

// third-party modules
const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

// local moudles
const imageRouter = require('./routes/image');
const feedbackRouter = require('./routes/feedback');
const cronJob = require('./cron/index');

var privateKey = fs.readFileSync('./sslcert/private.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/certificate.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  })
);

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

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });
}
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
    const httpServer = http.createServer(app);
    const http2Server = spdy.createServer(credentials, app);
    httpServer.listen(SERVER_PORT, () => {
      console.log(`http server is listening on port ${SERVER_PORT}`);
      cronJob.start();
    });
    http2Server.listen(443, () => {
      console.log(`http2 server is listening on port 443`);
    });
  })
  .catch(error => {
    console.error('error on db connection or starting server', error);
  });
