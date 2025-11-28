const validator = require('../helpers/validate');

/* ******************************************
 * Validate gifts -vy
 *******************************************/
const saveGift = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    price: 'required|numeric|min:1',
    department: 'required|string',
    brand: 'required|string',
    quantity: 'required|numeric',
    color: 'required|string',
    size: 'required|string',
    store: 'required|string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }
    next();
  });
};

/* ******************************************
 * Validate dishes (Food) -ea
 *******************************************/
const saveDish = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    categoryId: 'string',
    participantId: 'string',
    description: 'string',
    serves: 'integer|min:1',
    isVegetarian: 'boolean',
    isGlutenFree: 'boolean'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }
    next();
  });
};

module.exports = {
  saveGift,
  saveDish,
};
