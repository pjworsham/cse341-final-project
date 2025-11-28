// controllers/dish.js
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// Helper to get the dishes collection
const getCollection = () => {
  const client = mongodb.getDb();     // MongoClient from data/database.js
  const db = client.db();             // Uses DB name from MONGODB_URI (test)
  return db.collection('dishes');     // Collection: test.dishes
};

// POST /food/dish
const createDish = async (req, res) => {
  /*
    #swagger.tags = ['Food']
    #swagger.description = 'Create a new dish for the holiday party.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Potato Salad',
        categoryId: 'side',
        participantId: 'eric',
        description: "Grandma's recipe",
        serves: 6,
        isVegetarian: true,
        isGlutenFree: false
      }
    }
    #swagger.responses[201] = {
      description: 'Dish created successfully'
    }
    #swagger.responses[412] = {
      description: 'Validation failed (see saveDish middleware rules)'
    }
    #swagger.responses[500] = {
      description: 'Server error while creating dish'
    }
  */
  try {
    const dishData = {
      name: req.body.name,
      categoryId: req.body.categoryId || null,
      participantId: req.body.participantId || null,
      description: req.body.description || '',
      serves: req.body.serves ?? null,
      isVegetarian: req.body.isVegetarian ?? false,
      isGlutenFree: req.body.isGlutenFree ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!dishData.name) {
      return res.status(400).json({ error: 'Dish name is required' });
    }

    const collection = getCollection();
    const result = await collection.insertOne(dishData);

    res.status(201).json({ _id: result.insertedId, ...dishData });
  } catch (err) {
    console.error('Error creating dish:', err);
    res.status(500).json({ error: 'Failed to create dish' });
  }
};

// PUT /food/dish/:dishId
const updateDish = async (req, res) => {
  /*
    #swagger.tags = ['Food']
    #swagger.description = 'Update an existing dish by its ID.'
    #swagger.parameters['dishId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB ObjectId of the dish'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Updated Potato Salad',
        categoryId: 'side',
        participantId: 'eric',
        description: 'Less mayo, more mustard',
        serves: 8,
        isVegetarian: true,
        isGlutenFree: false
      }
    }
    #swagger.responses[200] = {
      description: 'Dish updated successfully'
    }
    #swagger.responses[400] = {
      description: 'Invalid dish id'
    }
    #swagger.responses[404] = {
      description: 'Dish not found'
    }
    #swagger.responses[412] = {
      description: 'Validation failed (see saveDish middleware rules)'
    }
    #swagger.responses[500] = {
      description: 'Server error while updating dish'
    }
  */
  const { dishId } = req.params;

  if (!ObjectId.isValid(dishId)) {
    return res.status(400).json({ error: 'Invalid dish id' });
  }

  try {
    const updates = {
      ...req.body,
      updatedAt: new Date(),
    };

    const collection = getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(dishId) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json(result.value);
  } catch (err) {
    console.error('Error updating dish:', err);
    res.status(500).json({ error: 'Failed to update dish' });
  }
};

// GET /food/dish
const getAllDishes = async (_req, res) => {
  /*
    #swagger.tags = ['Food']
    #swagger.description = 'Get all dishes for the holiday party.'
  */
  try {
    const collection = getCollection();
    const dishes = await collection.find().toArray();
    res.json(dishes);
  } catch (err) {
    console.error('Error fetching dishes:', err);
    res.status(500).json({ error: 'Failed to fetch dishes' });
  }
};

// GET /food/dish/:dishId
const getDishById = async (req, res) => {
  /*
    #swagger.tags = ['Food']
    #swagger.description = 'Get a single dish by its ID.'
  */
  const { dishId } = req.params;

  if (!ObjectId.isValid(dishId)) {
    return res.status(400).json({ error: 'Invalid dish id' });
  }

  try {
    const collection = getCollection();
    const dish = await collection.findOne({ _id: new ObjectId(dishId) });

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json(dish);
  } catch (err) {
    console.error('Error fetching dish by id:', err);
    res.status(500).json({ error: 'Failed to fetch dish' });
  }
};

// GET /food/dish/by-category/:categoryId
const getDishesByCategory = async (req, res) => {
  /*
    #swagger.tags = ['Food']
    #swagger.description = 'Get dishes filtered by categoryId (e.g., main, side, dessert).'
  */
  const { categoryId } = req.params;

  try {
    const collection = getCollection();
    const dishes = await collection.find({ categoryId }).toArray();
    res.json(dishes);
  } catch (err) {
    console.error('Error fetching dishes by category:', err);
    res.status(500).json({ error: 'Failed to fetch dishes by category' });
  }
};

// GET /food/dish/by-participant/:participantId
const getDishesByParticipant = async (req, res) => {
  /*
    #swagger.tags = ['Food']
    #swagger.description = 'Get dishes assigned to a specific participantId.'
  */
  const { participantId } = req.params;

  try {
    const collection = getCollection();
    const dishes = await collection.find({ participantId }).toArray();
    res.json(dishes);
  } catch (err) {
    console.error('Error fetching dishes by participant:', err);
    res.status(500).json({ error: 'Failed to fetch dishes by participant' });
  }
};

// DELETE /food/dish/:dishId
const deleteDish = async (req, res) => {
  /*
    #swagger.tags = ['Food']
    #swagger.description = 'Delete a dish by its ID.'
  */
  const { dishId } = req.params;
  console.log('DELETE /food/dish - dishId param:', dishId);

  if (!ObjectId.isValid(dishId)) {
    console.log('Invalid ObjectId:', dishId);
    return res.status(400).json({ error: 'Invalid dish id' });
  }

  try {
    const collection = getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(dishId) });

    console.log('deleteOne result:', result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    // 200 with message
    return res.status(200).json({ message: 'Dish deleted successfully' });

  } catch (err) {
    console.error('Error deleting dish:', err);
    res.status(500).json({ error: 'Failed to delete dish' });
  }
};

module.exports = {
  createDish,
  updateDish,
  getAllDishes,
  getDishById,
  getDishesByCategory,
  getDishesByParticipant,
  deleteDish,
};
