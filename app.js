import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';

import router from './router.js';
import pool from './db.js';

const app = express();

// use ejs to render HTML from templates in views/ directory
app.set('views', './views');
app.set('view engine', 'ejs');

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  }
}));

// make logged-in user info available to all templates on each request
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
// everything in public/ can be accessed by a client directly through the URL, e.g. /stylesheets/style.css
app.use(express.static('./public'));

// mount router
app.use('/', router);

// catch-all 404 not found, forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500);
  res.render('error', { error: err });
});

// start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

// gracefully handle shutdown signals
async function shutdown(signal) {
  console.log(`Received ${signal}; shutting down...`);

  server.close(async (serverError) => {
    if (serverError) {
      console.error('HTTP server shutdown error:', serverError);
      process.exitCode = 1;
    }

    try {
      await pool.end();
    } catch (databaseError) {
      console.error('Database shutdown error:', databaseError);
      process.exitCode = 1;
    }
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
