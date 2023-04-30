const clothingItem = require('../models/clothingItem');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ServerError = require('../utils/errors/ServerError');

const defaultError = new ServerError('An error has occurred on the server.');

module.exports.getItems = (req, res, next) => {
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
        return next(new BadRequestError('Invalid Name'));
      }
      return next(defaultError);
    });
};

module.exports.deleteItem = (req, res, next) => {
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
        return next(new BadRequestError('Invalid Id'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item ID not found'));
      }
      if (err.message === 'Invalid Access') {
        return next(new ForbiddenError('Invalid authorization'));
      }
      return next(defaultError);
    });
};

module.exports.likeItem = (req, res, next) => {
  clothingItem.findByIdAndUpdate(req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.send(item)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid Id'));
      }
      return next(defaultError);
    });
};

module.exports.dislikeItem = (req, res, next) => {
  clothingItem.findByIdAndUpdate(req.params.itemId, 
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((item) => {
    if (!item) {
      return next(new NotFoundError("Item not found"));
    }
    return res.send(item)
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid Id'))
    }
    return next(defaultError);
  });
};