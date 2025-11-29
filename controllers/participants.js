const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllParticipants = async (req, res) => {
  try {
    /* #swagger.tags = ['Participants'] */
    const participants = await mongodb
      .getDb()
      .db()
      .collection('participants')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(participants);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to find participants collection', error: err });
  }
};

const getSingleParticipants = async (req, res) => {
  try {
    /* #swagger.tags = ['participants'] */
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid participants id to find a participants.');
    }
    const participantsId = new ObjectId(req.params.id);
    const participants = await mongodb.getDb().db().collection('participants').findOne({ _id: participantsId });
    if (!participants) return res.status(404).json({ message: 'participants not found' });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(participants);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to find this page', error: err });
  }
};

const createParticipants = async (req, res) => {
  try {
    /* #swagger.tags = ['Participants'] */
    const participants = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      homeTown: req.body.homeTown,
      role: req.body.role,
      favoriteTreat: req.body.favoriteTreat,
      rsvpStatus: req.body.rsvpStatus,
      giftPreference: req.body.giftPreference
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('participants')
      .insertOne(participants);

    if (response.acknowledged) {
      return res.status(201).json({
        message: "participants created successfully",
        participantsId: response.insertedId
      });
    } else {
      return res
        .status(500)
        .json(response.error || 'Some error occurred while creating the participants.');
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server error while creating the participants.' });
  }
};

const updateParticipants = async (req, res) => {
  try {
    /* #swagger.tags = ['Participants'] */
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid participants id to update participants.');
    }

    const participantsId = new ObjectId(req.params.id);

    const participants = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      homeTown: req.body.homeTown,
      role: req.body.role,
      favoriteTreat: req.body.favoriteTreat,
      rsvpStatus: req.body.rsvpStatus,
      giftPreference: req.body.giftPreference
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('participants')
      .replaceOne({ _id: participantsId }, participants);

    if (response.modifiedCount > 0) {
      return res.status(200).json({
        message: 'Participants was successfully updated.',
        updatedId: req.params.id
      });
    } else {
      return res
        .status(404)
        .json({ message: 'Participants not found or nothing was updated.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Server error while updating the participants.'
    });
  }
};

const deleteParticipants = async (req, res) => {
  try {
    /* #swagger.tags = ['Participants'] */
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid participants id to delete a participants.');
    }

    const participantsId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('participants')
      .deleteOne({ _id: participantsId });

    if (response.deletedCount > 0) {
      return res.status(200).json({ message: 'Participants deleted successfully!' });
    } else {
      return res.status(404).json({ message: 'Participants not found' });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Error deleting participants', error: err });
  }
};

module.exports = {
  getAllParticipants,
  getSingleParticipants,
  createParticipants,
  updateParticipants,
  deleteParticipants
};