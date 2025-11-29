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
  res.send(`
    <h1>Welcome to the Holiday Party Planner</h1>
    <p>Click a link below to view the different routes:</p>
    <ul>
      <li><a href="/gifts">Gifts Collection</a></li>
      <li><a href="/food/dish">Food / Dishes Collection</a></li>
      <li><a href="/api-docs">Swagger Documentation</a></li>
    </ul>
  `);
});

// Take user to GitHub login to be authenticated
router.get('/login', passport.authenticate('github'), (req, res) => {});

// Logged out main screen
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


module.exports = router;
