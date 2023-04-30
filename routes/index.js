const router = require('express').Router();
const clothingItem = require('./clothingItem');
const users = require('./users');
const NotFoundError = require('../utils/errors/NotFoundError');

router.use('/', clothingItem);
router.use('/', users);
router.use((req, res, next) => {
  next(new NotFoundError('Router not found'));
});

module.exports = router;