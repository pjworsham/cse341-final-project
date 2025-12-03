const express = require('express');
const router = express.Router();
const giftsController = require('../controllers/gifts');
const {isAuthenticated} = require('../middleware/authenticate');
const validation = require('../middleware/validate');

router.get('/',
  giftsController.getAllGifts);
router.get('/:id',
  giftsController.getSingleGift);
router.post('/',
  isAuthenticated,
  validation.saveGift,
  giftsController.createGift);
router.put('/:id',
  isAuthenticated,
  validation.saveGift,
  giftsController.updateGift);
router.delete('/:id',
  isAuthenticated,
  giftsController.deleteGift);

module.exports = router;