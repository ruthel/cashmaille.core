const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const validator = require("validator");

const {
  Schema
} = mongoose;

const userSchema = new Schema({
    password: {
      type: String,
      trim: true,
      required: true,
    },
    profile: {
      type: String,
    },
    phone: {
      trim: true,
      required: true,
      type: String,
    },
    username: {
      trim: true,
      required: true,
      type: String,
    },
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;