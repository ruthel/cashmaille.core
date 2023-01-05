const mongoose = require("mongoose")

const {
  Schema
} = mongoose;

const schema = new Schema({
    name: {
      type: String,
      required: true
    },
    ref: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true
  }
);


const model = mongoose.model('Product', schema);
module.exports = model;