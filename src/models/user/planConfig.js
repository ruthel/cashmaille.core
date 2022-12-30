const mongoose = require("mongoose")

const {
  Schema
} = mongoose;

const schema = new Schema({
  maxDoc: {
    type: Number,
    required: true,
    default: 2
  },
  subscriptionActivated: {
    type: Boolean,
    required: false,
    default: false
  }
}, {
  timestamps: true
});
const model = mongoose.model('PlanConfig', schema);
module.exports = model;