const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllGifts = async (req, res) => {
  try {
    /* #swagger.tags = ['Gifts'] */
    const gifts = await mongodb
      .getDb()
      .db()
      .collection('gifts')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(gifts);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to find gifts collection', error: err });
  }
};

const getSingleGift = async (req, res) => {
  try {
    /* #swagger.tags = ['Gifts'] */
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid gift id to find a gift.');
    }
    const giftId = new ObjectId(req.params.id);
    const gift = await mongodb.getDb().db().collection('gifts').findOne({ _id: giftId });
    if (!gift) return res.status(404).json({ message: 'Gift not found' });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(gift);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to find this page', error: err });
  }
};

const createGift = async (req, res) => {
  try {
    /* #swagger.tags = ['Gifts'] */
    const gift = {
      name: req.body.name,
      price: req.body.price,
      department: req.body.department,
      brand: req.body.brand,
      quantity: req.body.quantity,
      color: req.body.color,
      size: req.body.size,
      store: req.body.store
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('gifts')
      .insertOne(gift);

    if (response.acknowledged) {
      return res.status(201).json({
        message: "Gift created successfully",
        giftId: response.insertedId
      });
    } else {
      return res
        .status(500)
        .json(response.error || 'Some error occurred while creating the gift.');
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server error while creating the gift.' });
  }
};

const updateGift = async (req, res) => {
  try {
    /* #swagger.tags = ['Gifts'] */
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid gift id to update gift.');
    }

    const giftId = new ObjectId(req.params.id);

    const gift = {
      name: req.body.name,
      price: req.body.price,
      department: req.body.department,
      brand: req.body.brand,
      quantity: req.body.quantity,
      color: req.body.color,
      size: req.body.size,
      store: req.body.store
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('gifts')
      .replaceOne({ _id: giftId }, gift);

    if (response.modifiedCount > 0) {
      return res.status(200).json({
        message: 'Gift was successfully updated.',
        updatedId: req.params.id
      });
    } else {
      return res
        .status(404)
        .json({ message: 'Gift not found or nothing was updated.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Server error while updating the gift.'
    });
  }
};

const deleteGift = async (req, res) => {
  try {
    /* #swagger.tags = ['Gifts'] */
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid gift id to delete a gift.');
    }

    const giftId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('gifts')
      .deleteOne({ _id: giftId });

    if (response.deletedCount > 0) {
      return res.status(200).json({ message: 'Gift deleted successfully!' });
    } else {
      return res.status(404).json({ message: 'Gift not found' });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Error deleting gift', error: err });
  }
};

module.exports = {
  getAllGifts,
  getSingleGift,
  createGift,
  updateGift,
  deleteGift,
};
