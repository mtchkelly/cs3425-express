require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');

const router = require('./router');
const connection = require('./db');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

// route setup
app.use('/', router);

// catch-all 404 not found, forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// start the server and gracefully handle shutdown signals
if (require.main === module) {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });

  function shutdown(signal) {
    console.log(`Received ${signal}; shutting down...`);

    server.close((serverError) => {
      if (serverError) {
        console.error('HTTP server shutdown error:', serverError);
        process.exitCode = 1;
      }

      connection.end((databaseError) => {
        if (!databaseError) return;
        console.error('Database shutdown error:', databaseError);
        process.exitCode = 1;
      });
    });
  }

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = app;
