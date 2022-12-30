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
    phone: {
      trim: true,
      required: true,
      type: String,
    },
    username: {
      trim: true,
      required: true,
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }
      }
    },
    matricule: {
      type: String,
      trim: true,
      required: true,
    },
    draft: [{
      required: false,
      type: Object,
    }],
    tokens: {
      type: String,
      required: false
    },
    password: String,
    accountVerified: {
      type: Boolean,
      default: false,
    },
    accountBlocked: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailResetToken: String,
    planConfig: {
      maxDoc: {
        type: Number,
        required: true,
        default: 2
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual('reports', {
  ref: 'Report',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject()
  
  delete userObject.password
  delete userObject.tokens
  // delete userObject.accountVerified;
  // delete userObject.accountBlocked;
  delete userObject.emailVerificationToken;
  delete userObject.emailResetToken;
  
  //delete userObject.avatar
  
  return userObject
}


//function to generate the access token
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({
    id: user.id
  }, "ilovepizzastheyaremyfavoritemealandiwouldlovetoeatthemdayinandoutforthesakeofmotherofgod1234567890");
  
  user.tokens = token
  await user.save()
  
  return token
}

//function to generate email verification token
userSchema.methods.generateEmailVerificationToken = async function () {
  const user = this
  const hashedEmail = await bcrypt.hash(user.email, 8);
  const token = jwt.sign({
    token: hashedEmail
  }, "ilovepizzastheyaremyfavoritemealandiwouldlovetoeatthemdayinandoutforthesakeofmotherofgod1234567890", {
    expiresIn: 60 * 30
  });
  
  user.emailVerificationToken = token;
  await user.save()
  
  return token;
}

//function to generate email reset token
userSchema.methods.generateEmailResetToken = async function () {
  const user = this
  const hashedEmail = await bcrypt.hash(user.email, 8);
  const token = jwt.sign({
    token: hashedEmail
  }, "ilovepizzastheyaremyfavoritemealandiwouldlovetoeatthemdayinandoutforthesakeofmotherofgod1234567890", {
    expiresIn: 60 * 30
  });
  
  user.emailResetToken = token;
  await user.save()
  
  return token
}


//check if users email is not already in use
userSchema.statics.checkEmailInUse = async (email) => {
  const user = await User.findOne({
    email
  })
  if (user) {
    return user
  }
  
}


//find user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
      email,
      accountVerified: true,
      accountBlocked: false,
      'planConfig.subscriptionActivated': true
    }
  )
  
  if (!user) {
    return;
  }
  const isMatch = await bcrypt.compare(password, user.password)
  
  if (!isMatch) {
    return;
  }
  
  return user;
}

//Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this
  
  if (user.isModified('password')) {
    
    user.password = await bcrypt.hash(user.password, 8)
  }
  
  next()
})


//delete or block user's projects when he will be removed or blocked
userSchema.pre('remove', async function (next) {
  //TODO
  next()
})


const User = mongoose.model('User', userSchema);
module.exports = User;