const router = require('express').Router();
const { getItems, createItem, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingItem');
const auth = require('../middleware/auth');

router.get('/items', getItems);
router.post('/items', auth, createItem);
router.delete('/items/:itemId', auth, deleteItem);
router.put('/items/:itemId/likes', auth, likeItem);
router.delete('/items/:itemId/likes', auth, dislikeItem);

module.exports = router;