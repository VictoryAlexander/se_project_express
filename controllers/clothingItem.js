const clothingItem = require('../models/clothingItem');
const { BadRequestError, ForbiddenError, NotFoundError, ServerError } = require('../utils/errors');
const defaultError = new ServerError('An error has occurred on the server.');

module.exports.getItems = (req, res) => {
  clothingItem.find({})
    .then(items => res.send(items))
    .catch(() => next(defaultError));
};

module.exports.createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem.create({ name, weather, imageUrl, owner })
    .then(item => res.send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid Name'));
      }
      next(defaultError);
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
        .send(item));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Id'));
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Item ID not found'));
      }
      if (err.message === 'Invalid Access') {
        next(new ForbiddenError('Invalid authorization'));
      }
      next(defaultError);
    });
};

module.exports.likeItem = (req, res) => {
  clothingItem.findByIdAndUpdate(req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
      }
      return res.send(item)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Id'));
      }
      next(defaultError);
    });
};

module.exports.dislikeItem = (req, res) => {
  clothingItem.findByIdAndUpdate(req.params.itemId, 
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((item) => {
    if (!item) {
      next(new NotFoundError("Item not found"));
    }
    return res.send(item)
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid Id'))
    }
    next(defaultError);
  });
};