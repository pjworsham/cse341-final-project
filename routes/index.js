const router = require('express').Router();
const passport = require('passport');

/* ******************************************
 * Swagger API-Docs -vy
 *******************************************/
router.use('/', require('./swagger'));

/* ******************************************
 * Main Resource Routes
 *******************************************/
// Gifts routes (Vanessa)
router.use('/gifts', require('./gifts'));

// Food / dishes routes (Eric)
router.use('/food', require('./food'));  // <-- uses routes/food.js


/* ******************************************
 * Basic Home Route -vy -ea
 *******************************************/
router.get('/', (req, res) => {
  const loggedIn = req.session?.user !== undefined;

  res.send(`
    <h1>Welcome to the Holiday Party Planner</h1>
    <p>You are currently ${loggedIn ? `Welcome ${req.session.user.displayName}.`
      : 'logged out'}.</p>
    <p>Click a link below to view the different routes:</p>
    <ul>
      <li><a href="/gifts">Gifts Collection</a></li>
      <li><a href="/food/dish">Food / Dishes Collection</a></li>
      <li><a href="/api-docs">Swagger Documentation</a></li>
    </ul>
  `);
});

/* ******************************************
 * Route to take user to GitHub login to be authenticated -vy
 *******************************************/
router.get('/login', passport.authenticate('github'), (req, res) => {});

/* ******************************************
 * Route to log out user -vy
 *******************************************/
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


module.exports = router;
