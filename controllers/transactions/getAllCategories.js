const categories = require('./categories.json');

const RequestError = require('../../helpers');

const getAllCategory = (req, res) => {
  if (!categories) {
    throw RequestError(404, 'No categories');
  }
  res.status(200).json({ categories });
};

module.exports = getAllCategory;
