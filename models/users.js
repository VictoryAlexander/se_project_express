const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const users = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Elise Bouer'
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Please Enter a valid URL',
    },
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png'
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Invalid Email',
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

users.statics.findUserByCredentials = function findUserByCredentials (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }
          return user;
        })
    })
}

module.exports = mongoose.model('users', users);