require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

/* ******************************************
 * Middleware -vy
 *******************************************/
app
  .use(express.json())
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Z-Key',
      'Authorization',
    ],
  }))

  .use('/', require('./routes/index.js'));

/* ******************************************
 * Error handler -vy
 *******************************************/
process.on('uncaughtException', (err, origin) => {
  console.error('Caught exception:', err);
  console.error('Exception origin:', origin);
  process.exit(1);
});


/* ******************************************
 * 400 error Handler
 *******************************************/
app.use((req, res) => {
  res
    .status(404)
    .send(`
      <h1>Where did it go?!</h1>
      <p>Seems like this page doesn't exist...</p>
      <a href="/">Go Back</a>
    `);
});

/* ******************************************
 * MondoDB -vy
 *******************************************/
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
});
