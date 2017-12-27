const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;
const UserSchema = new Schema({
  account: {
    type: String,
    unique: true,
    require: true,
    trim: true,
    minlength: 1
  },
  password: {
    type: String,
    minlength: 6,
    require: true
  },
  nickname: {
    type: String,
    unique: true
  },
  avatar: {
    type: String,
    default: 'default.png'
  },
  tokens: [
    {
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        require: true
      }
    }
  ]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
