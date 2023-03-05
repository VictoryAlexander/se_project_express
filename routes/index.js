const router = require('express').Router();
const clothingItem = require('./clothingItem');
const users = require('./users');
const { nonExistentError } = require('../utils/errors');

router.use('/', clothingItem);
router.use('/', users);
router.use((req, res) => {
  res.status(nonExistentError).send({ message: 'Router not found' });
});

module.exports = router;