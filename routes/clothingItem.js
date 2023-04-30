const router = require('express').Router();
const { getItems, createItem, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingItem');
const auth = require('../middleware/auth');
const { validateNewItem, validateItemId } = require('../middleware/validation')

router.get('/items', getItems);
router.post('/items', auth, validateNewItem, createItem);
router.delete('/items/:itemId', auth, validateItemId, deleteItem);
router.put('/items/:itemId/likes', auth, validateItemId, likeItem);
router.delete('/items/:itemId/likes', auth, validateItemId, dislikeItem);

module.exports = router;