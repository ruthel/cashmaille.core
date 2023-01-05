const mongoose = require("mongoose")

const {
  Schema
} = mongoose;

const schema = new Schema({
    name: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    price: {
      type: Boolean,
    },
  },
  {
    timestamps: true
  }
);


const model = mongoose.model('Product', schema);
module.exports = model;