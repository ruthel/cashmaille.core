const mongoose = require("mongoose");

const Schema = mongoose.Schema;


//sub schema
const contentObjectSchema = require("./sub_elements");

const introductionSchema = new Schema({
    title: {
        type: String,
        minlength: [10, 'Short intro'],
        maxlength: [1000, 'Long into']
    },
    defaultTitle: String,
    style: Object,
    content: [
        contentObjectSchema
    ],
    storageFolder: {
        imageFolder: {
            type: String,
        }
    },
});

module.exports = introductionSchema;