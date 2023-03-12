const router = require('express').Router();
const { getUsers, getCurrentUser, createUser, login, updateProfile } = require('../controllers/users');
const auth = require('../middleware/auth');

router.post('/signin', login);
router.post('/signup', createUser);
router.get('./users', getUsers);
router.get('./users/me', auth, getCurrentUser);
router.patch('./users/me', auth, updateProfile);

module.exports = router;