const clothingItem = require('../models/clothingItem');
const { invalidDataError, forbiddenError, nonExistentError, defaultError } = require('../utils/errors');

module.exports.getItems = (req, res) => {
  clothingItem.find({})
    .then(items => res.send({ data: items }))
    .catch(() => res.status(defaultError).send({ message: 'An error has occurred on the server.' }));
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem.create({ name, weather, imageUrl, owner })
    .then(item => res.send({ data: item }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(invalidDataError).send({ message: 'Invalid Name' })
      }
      return res.status(defaultError).send({ message: 'An error has occurred on the server.' })
    });
};

module.exports.deleteItem = (req, res) => {
  clothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new Error('Invalid Access');
      }
      return item.deleteOne().then(() => res
        .status(200)
        .send({ message: 'Item Deleted', deleted: item }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(invalidDataError).send({ message: 'Invalid Id' })
      } 
      if (err.name === 'DocumentNotFoundError') {
        return res.status(nonExistentError).send({ message: 'Item ID not found' })
      } 
      if (err.message === 'Invalid Access') {
        return res.status(forbiddenError).send({ message: 'Invalid authorization' })
      }
      return res.status(defaultError).send({ message: 'An error has occurred on the server.' })
    });
};

module.exports.likeItem = (req, res) => {
  clothingItem.findByIdAndUpdate(req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return res.status(nonExistentError).send({ message: "Item not found" })
      }
      return res.send({ data: item })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(invalidDataError).send({ message: 'Invalid Id' })
      }
      return res.status(defaultError).send({ message: 'An error has occurred on the server.' })
    });
};

module.exports.dislikeItem = (req, res) => {
  clothingItem.findByIdAndUpdate(req.params.itemId, 
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((item) => {
    if (!item) {
      return res.status(nonExistentError).send({ message: "Item not found" })
    }
    return res.send({ data: item })
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(invalidDataError).send({ message: 'Invalid Id' })
    }
    return res.status(defaultError).send({ message: 'An error has occurred on the server.' })
  });
};