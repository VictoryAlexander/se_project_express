const router = require('express').Router();
const { getItems, createItem, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingItem');

router.get('/items', getItems);
router.post('/items', createItem);
router.delete('/items/:itemId', deleteItem);
router.put('/items/:itemId/likes', likeItem);
router.delete('/items/:itemId/likes', dislikeItem);

module.exports = router;