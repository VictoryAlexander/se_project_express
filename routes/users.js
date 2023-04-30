const router = require('express').Router();
const { getCurrentUser, createUser, login, updateProfile } = require('../controllers/users');
const auth = require('../middleware/auth');
const { validateNewUser, validateExistingUser } = require('../middleware/validation');

router.get('/users/me', auth, getCurrentUser);
router.patch('/users/me', auth, updateProfile);
router.post('/signin', validateExistingUser, login);
router.post('/signup', validateNewUser, createUser);

module.exports = router;