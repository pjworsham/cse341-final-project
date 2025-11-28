// routes/food.js
const express = require('express');
const router = express.Router();
const dish = require('../controllers/dish.js');
const { saveDish } = require('../middleware/validate');   // ⬅ ADD THIS

/**
 * FOOD / DISHES ROUTES
 *
 * Based on proposal:
 *  POST   /dish
 *  PUT    /dish/:dishId
 *  GET    /dish
 *  GET    /dish/:dishId
 *  GET    /dish/by-category/:categoryId
 *  GET    /dish/by-participant/:participantId
 *  DELETE /dish/:dishId
 */

// Create a new dish
router.post('/dish', saveDish, dish.createDish);

// Update an existing dish
router.put('/dish/:dishId', saveDish, dish.updateDish);

// Get all dishes
router.get('/dish', dish.getAllDishes);

// Add more specific routes before /dish/:dishId

// Get dishes by category
router.get('/dish/by-category/:categoryId', dish.getDishesByCategory);

// Get dishes by participant
router.get('/dish/by-participant/:participantId', dish.getDishesByParticipant);

// Get a single dish by id
router.get('/dish/:dishId', dish.getDishById);

// Delete a dish
router.delete('/dish/:dishId', dish.deleteDish);

module.exports = router;
