const bcrypt = require('bcrypt');
const users = require('../models/users');
const jwt = require('jsonwebtoken');
const { invalidDataError, unAuthorizedError, nonExistentError, conflictError, defaultError } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  users.find({})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(defaultError).send({ message: 'An error has occurred on the server.' }));
};

module.exports.getCurrentUser = (req, res) => {
  users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(nonExistentError).send({ message: "User not found" })
      }
      return res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid user id" })
      } else {
        res.status(defaultError).send({ message: 'An error has occurred on the server.' })
      }
    });
};

module.exports.createUser = (req, res) => {

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
        res.status(invalidDataError).send({ message: "Invalid user id" })
      } else if(err.code === 11000) {
        res.status(conflictError).send({ message: 'User Already Exists' })
      } else {
        res.status(defaultError).send({ message: 'An error has occurred on the server.' })
      }
    })
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(unAuthorizedError)
        .send({ message: 'Authorization Error' });
    });
};

module.exports.updateProfile = (req, res) => {
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
      return res.status(nonExistentError).send({ message: "User not found" })
    }
    return res.send({ data: user })
  })
  .catch((err) => {
    if (err.name === "CastError") {
      res.status(invalidDataError).send({ message: "Invalid user id" })
    } else if (err.name === "ValidationError") {
      res.status(invalidDataError).send({ message: "Invalid user id" })
    } else {
      res.status(defaultError).send({ message: 'An error has occurred on the server.' })
    }
  });
}