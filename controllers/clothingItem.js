const clothingItem = require('../models/clothingItem');
const { invalidDataError, nonExistentError, defaultError } = require('../utils/errors');

module.exports.getItems = (req, res) => {
  clothingItem.find({})
    .then(items => res.send({ data: items }))
    .catch(err => res.status(500).send({ message: err.message }));
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
      return res.status(500).send({ message: err.message })
    });
};

module.exports.deleteItem = (req, res) => {
  clothingItem.findByIdAndRemove(req.params.itemId)
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
      return res.status(500).send({ message: err.message })
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
      return res.status(500).send({ message: err.message })
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
    return res.status(500).send({ message: err.message })
  });
};