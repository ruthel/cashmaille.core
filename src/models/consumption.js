const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const validator = require("validator");

const {
  Schema
} = mongoose;

const schema = new Schema({
    amount: {
      type: Number,
      trim: true,
      required: true,
    },
    tType: {
      type: String,
      required: true,
      enum: ['debit', 'credit'],
      default: 'credit'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User'
    },
  },
  {
    timestamps: true
  }
);

const Consumption = mongoose.model('Consumption', schema);
module.exports = Consumption;