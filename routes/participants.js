const express = require('express');
const router = express.Router();
const participantsController = require('../controllers/participants');
const {isAuthenticated} = require('../middleware/authenticate');
const validation = require('../middleware/validate');

router.get('/', participantsController.getAllParticipants);
router.get('/:id', participantsController.getSingleParticipants);
router.post('/', isAuthenticated, validation.saveParticipants, participantsController.createParticipants);
router.put('/:id', isAuthenticated, validation.saveParticipants, participantsController.updateParticipants);
router.delete('/:id', isAuthenticated, participantsController.deleteParticipants);

module.exports = router;