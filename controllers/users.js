const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../models/users');
const { BadRequestError } = require('../utils/errors/BadRequestError');
const { ConflictError } = require('../utils/errors/ConflictError');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { ServerError } = require('../utils/errors/ServerError');
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');
const defaultError = new ServerError('An error has occurred on the server.');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  users.find({})
    .then(user => res.send({ data: user }))
    .catch(() => next(defaultError));
};

module.exports.getCurrentUser = (req, res, next) => {
  users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user id"));
      } else {
        next(defaultError);
      }
    });
};

module.exports.createUser = (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
    .then((hash) => users.create({
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
    }))
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email
      })
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user id"));
      } else if(err.code === 11000) {
        next(new ConflictError('User Already Exists'));
      } else {
        next(defaultError);
      }
    })
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'HE DOESNT KNOW', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Authorization Error'));
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  users.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
  .then((user) => {
    if (!user) {
      return next(new NotFoundError("User not found"));
    }
    return res.send({ data: user })
  })
  .catch((err) => {
    if (err.name === "CastError") {
      next(new BadRequestError("Invalid user id"));
    } else if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid user id"));
    } else {
      next(defaultError);
    }
  });
}