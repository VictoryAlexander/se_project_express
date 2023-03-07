const users = require('../models/users');
const { invalidDataError, nonExistentError, defaultError } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  users.find({})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(defaultError).send({ message: 'An error has occurred on the server.' }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  users.findById(userId)
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
  const { name, avatar } = req.body;

  users.create({ name, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(invalidDataError).send({ message: "Invalid user id" })
      } else {
        res.status(defaultError).send({ message: 'An error has occurred on the server.' })
      }
    });
};