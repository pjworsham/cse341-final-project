const express = require('express');
const router = express.Router();

const participantsController = require('../controllers/participants');

const validation = require('../middleware/validate');

router.get('/', participantsController.getAllParticipants);
router.get('/:id', participantsController.getSingleParticipants);
router.post('/', validation.saveParticipants, participantsController.createParticipants);
router.put('/:id', validation.saveParticipants, participantsController.updateParticipants);
router.delete('/:id', participantsController.deleteParticipants);

module.exports = router;