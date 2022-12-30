const mongoose = require("mongoose");

const Schema = mongoose.Schema;


//sub schema
const contentObjectSchema = require("./sub_elements");

const prefaceSchema = new Schema({
  fixed: {
    type: Boolean,
  },
  abstract: {
    type: Boolean,
  },
  style: {
    type: Object,
  },
  obj: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true,
    enum: ['A', 'T'],
  },
  btn: {
    type: String,
    trim: true
  },
  content: {
    type: Object
  },
});

module.exports = prefaceSchema;