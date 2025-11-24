const express = require('express');
const router = express.Router();

const giftsController = require('../controllers/gifts');

const validation = require('../middleware/validate');

router.get('/', giftsController.getAllGifts);
router.get('/:id', giftsController.getSingleGift);
router.post('/', validation.saveGift, giftsController.createGift);
router.put('/:id', validation.saveGift, giftsController.updateGift);
router.delete('/:id', giftsController.deleteGift);

module.exports = router;