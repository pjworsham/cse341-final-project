require('dotenv').config({ quiet: true }); // <-- Be Quiet! Turn off the useless msgs

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

/* ******************************************
 * Middleware -vy
 *******************************************/
app
  .use(express.json())
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }))
  .use(passport.initialize())   
  .use(passport.session())      
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods",
      "POST, GET, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
  })
  .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
  .use(cors({ origin: '*' }));


/* ******************************************
 * OAuth Route -vy
 *******************************************/
app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs', session: false }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);


/* ******************************************
 * Main App Routes -vy
 *******************************************/
app.use('/', require('./routes/index.js'));


/* ******************************************
 * Passport Config -vy
 *******************************************/
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});


/* ******************************************
 * Error Handlers & Mongo Launch
 *******************************************/
process.on('uncaughtException', (err, origin) => {
  console.error('Caught exception:', err);
  console.error('Exception origin:', origin);
  process.exit(1);
});

app.use((req, res) => {
  res.status(404).send(`
    <h1>Where did it go?!</h1>
    <p>Seems like this page doesn't exist...</p>
    <a href="/">Go Back</a>
  `);
});

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});
