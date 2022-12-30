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
  urls: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Clipboard_item'
  }],
  doc_owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Report'
  },
}, {
  timestamps: true
});

const model = mongoose.model('Clipboard_category', schema);
module.exports = model;