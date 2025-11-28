// models/dish.js 
// NOT USED unless we switch to Mongoose - currently using native MongoDB driver
const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // Dish name
    categoryId: { type: String },                    // e.g. "main", "side", "dessert" or an ID
    participantId: { type: String },                 // link to participant bringing the dish
    description: { type: String },                   // optional notes like Spicy, Chilled, With Nuts, etc.
    serves: { type: Number },                        // how many people it serves
    isVegetarian: { type: Boolean, default: false }, // Vegetarian flag
    isGlutenFree: { type: Boolean, default: false }, // Gluten-free flag
  },
  { timestamps: true }                               // adds createdAt and updatedAt
);

module.exports = mongoose.model('Dish', dishSchema); // Collection will be "dishes"
