const user = require('../models/user');
const { invalidDataError, nonExistentError, defaultError } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  user.find({})
    .then(users => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  user.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(nonExistentError).send({ message: "User not found" })
      }
      return res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(invalidDataError).send({ message: "Invalid user id" })
      }else {
        res.status(500).send({ message: err.message})
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  user.create({ name, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(invalidDataError).send({ message: err.message }));
};