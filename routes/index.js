// routes/index.js
const router = require('express').Router();

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

// Locations routes (Pam)
router.use('/locations', require('./locations'));
// Participants routes (Keith)
router.use('/participants', require('./participants'));


/* ******************************************
 * Basic Home Route -vy -ea -kw
 *******************************************/
router.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Holiday Party Planner</h1>
    <p>Click a link below to view the different routes:</p>
    <ul>
      <li><a href="/gifts">Gifts Collection</a></li>
      <li><a href="/food/dish">Food / Dishes Collection</a></li>
      <li><a href="/locations">Locations Collection</a></li>
      <li><a href="/participants">Participants Collection</a></li>
      <li><a href="/api-docs">Swagger Documentation</a></li>
    </ul>
  `);
});

module.exports = router;
