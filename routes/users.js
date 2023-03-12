const router = require('express').Router();
const { getCurrentUser, createUser, login, updateProfile } = require('../controllers/users');
const auth = require('../middleware/auth');

router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, updateProfile);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;