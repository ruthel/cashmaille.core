const mongoose = require("mongoose")

const {
  Schema
} = mongoose;

const schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'Clipboard_category'
  },
  url: {
    type: String,
    trim: true,
    required: true,
  },
}, {
  timestamps: true
});

const model = mongoose.model('Clipboard_item', schema);
module.exports = model;