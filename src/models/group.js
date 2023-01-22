const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const validator = require("validator");

const {
  Schema
} = mongoose;

const schema = new Schema({
    designation: {
      type: String,
      trim: true,
      required: true,
    },
    labels: {
      type: String,
      required: true,
      enum: ['default'],
      default: 'default'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }],
  },
  {
    timestamps: true
  }
);

const Group = mongoose.model('Group', schema);
module.exports = Group;