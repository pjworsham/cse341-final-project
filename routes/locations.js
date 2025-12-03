const express = require('express');
const router = express.Router();

const locationsController = require('../controllers/locations');

const validation = require('../middleware/validate');

router.get('/', locationsController.getAllLocations);
router.get('/:id', locationsController.getSingleLocations);
router.post('/', validation.saveLocations, locationsController.createLocations);
router.put('/:id', validation.saveLocations, locationsController.updateLocations);
router.delete('/:id', locationsController.deleteLocations);

module.exports = router;