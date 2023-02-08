const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const validator = require("validator");

const {
  Schema
} = mongoose;

const schema = new Schema({
    total: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    products: [
      {
        element: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product'
        },
        count: {
          type: Number,
          default: 1,
          required: true,
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Consumption = mongoose.model('Consumption', schema);
module.exports = Consumption;