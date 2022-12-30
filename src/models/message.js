const mongoose = require("mongoose")

const {
  Schema
} = mongoose;

const schema = new Schema({
    text: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User'
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User'
    },
  },
  {
    timestamps: true
  }
);


const model = mongoose.model('Message', schema);
module.exports = model;