const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locations');
const {isAuthenticated} = require('../middleware/authenticate');
const validation = require('../middleware/validate');

router.get('/', locationsController.getAllLocations);
router.get('/:id', locationsController.getSingleLocations);
router.post('/', isAuthenticated, validation.saveLocations, locationsController.createLocations);
router.put('/:id', isAuthenticated, validation.saveLocations, locationsController.updateLocations);
router.delete('/:id', isAuthenticated, locationsController.deleteLocations);

module.exports = router;