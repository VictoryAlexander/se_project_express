const mongoose = require('mongoose');
const validator = require('validator');

const users = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Please Enter a valid URL',
    }
  }
})

module.exports = mongoose.model('users', users);