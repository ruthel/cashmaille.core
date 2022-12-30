const mongoose = require("mongoose");

const Schema = mongoose.Schema;


//sub schema
const contentObjectSchema = require("./sub_elements");

const conclusionSchema = new Schema(
  {
    // title: {
    //     type: String,
    //     minlength: [10, 'Short conclusion'],
    //     maxlength: [1000, 'Long conclusion']
    // },
    defaultTitle: String,
    content: [
      {type: Object}
    ],
    storageFolder: {
      imageFolder: {
        type: String,
      }
    },
  });

module.exports = conclusionSchema;