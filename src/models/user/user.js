const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const validator = require("validator");

const {
  Schema
} = mongoose;

const userSchema = new Schema({
    password: {
      type: String,
      trim: true,
      required: true,
    },
    profile: {
      type: String,
    },
    userCode: {
      trim: true,
      required: true,
      type: String,
    },
    phone: {
      trim: true,
      required: true,
      type: String,
    },
    token: {
      trim: true,
      required: true,
      type: String,
    },
    username: {
      trim: true,
      required: true,
      type: String,
    },
    awaitingPair: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }],
    network: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }],
  },
  {
    timestamps: true
  }
);

//function to generate email verification token
userSchema.methods.generateEmailVerificationToken = async function () {
  const user = this
  const hashed = await bcrypt.hash(user.username, 8);
  const token = jwt.sign({
    token: hashed
  }, "ilovepizzastheyaremyfavoritemealandiwouldlovetoeatthemdayinandoutforthesakeofmotherofgod1234567890", {
    expiresIn: 60 * 30
  });

  user.token = token;
  await user.save()

  return token;
}

const User = mongoose.model('User', userSchema);
module.exports = User;