const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllLocations = async (req, res) => {
  try {
    /* #swagger.tags = ['Locations'] */
    const locations = await mongodb
      .getDb()
      .db()
      .collection('locations')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(locations);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to find locations collection', error: err });
  }
};

const getSingleLocations = async (req, res) => {
  try {
    /* #swagger.tags = ['Locations'] */
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid locations id to find a locations.');
    }
    const locationsId = new ObjectId(req.params.id);
    const locations = await mongodb.getDb().db().collection('locations').findOne({ _id: locationsId });
    if (!locations) return res.status(404).json({ message: 'locations not found' });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(locations);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to find this page', error: err });
  }
};

const createLocations = async (req, res) => {
  try {
    /* #swagger.tags = ['Locations'] */
    const locations = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      capacity: req.body.capacity,
      priceRange: req.body.priceRange
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('locations')
      .insertOne(locations);

    if (response.acknowledged) {
      return res.status(201).json({
        message: "Locations created successfully",
        locationsId: response.insertedId
      });
    } else {
      return res
        .status(500)
        .json(response.error || 'Some error occurred while creating the locations.');
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server error while creating the locations.' });
  }
};

const updateLocations = async (req, res) => {
  try {
    /* #swagger.tags = ['Locations'] */
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid locations id to update locations.');
    }

    const locationsId = new ObjectId(req.params.id);

    const locations = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      capacity: req.body.capacity,
      priceRange: req.body.priceRange
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('locations')
      .replaceOne({ _id: locationsId }, locations);

    if (response.modifiedCount > 0) {
      return res.status(200).json({
        message: 'Locations was successfully updated.',
        updatedId: req.params.id
      });
    } else {
      return res
        .status(404)
        .json({ message: 'Locations not found or nothing was updated.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Server error while updating the locations.'
    });
  }
};

const deleteLocations = async (req, res) => {
  try {
    /* #swagger.tags = ['Locations'] */
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid locations id to delete a locations.');
    }

    const locationsId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('locations')
      .deleteOne({ _id: locationsId });

    if (response.deletedCount > 0) {
      return res.status(200).json({ message: 'Locations deleted successfully!' });
    } else {
      return res.status(404).json({ message: 'Locations not found' });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Error deleting locations', error: err });
  }
};

module.exports = {
  getAllLocations,
  getSingleLocations,
  createLocations,
  updateLocations,
  deleteLocations,
};