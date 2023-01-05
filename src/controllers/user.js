const validator = require('validator');
const {invalidData} = require('../helpers/error');
const {sendWelcomeEmail, sendPasswordResetEmail} = require("../helpers/mail")

const User = require('../models/user/user');
const fs = require("fs");
const Message = require("../models/product");


exports.signUp = async (req, res) => {
  try {
    if (req.body.phone) {
      let exist = await User.findOne({phone: req.body.phone})
      if (exist) {
        console.log("Duplicated phone")
        return res.status(409)
      } else {
        new User({...req.body, userCode: (new Date().getTime()).toString(16)}).save().then(doc => {
          console.log("Data saved successfully")
          return res.status(201).json(doc)
        }, (reason) => {
          console.log("Unable to save data", reason)
          return res.status(400)
        })
      }
    } else {
      console.log("Bad request");
      res.status(400)
    }
  } catch (error) {
    console.log(error)
    if (error.message.startsWith("User validation")) {
      return invalidData({
        res,
      })
    }
    return invalidData({
      res, statusCode: 500, error
    });
  }

}
exports.signIn = async (req, res) => {
  try {
    let user = await User.findOne({phone: req.body.phone, password: req.body.password})
    if (user) {
      const token = await user.generateEmailVerificationToken();
      user = JSON.parse(JSON.stringify(user))
      res.status(200).json({...user, token})
    } else {
      return invalidData({
        res, error: 'No user account', statusCode: 404
      });
    }
  } catch (e) {
    console.log(e)
    res.status(500).json()
  }
}
exports.searchForUser = async (req, res) => {
  try {
    const users = await User.find({userCode: {$regex: `.*${req.body.userCode}.*`}})
    res.status(200).json(users)
  } catch (e) {
    console.log(e)
    res.status(500).json()
  }
}
exports.awaitingPair = async (req, res) => {
  try {
    let user = await User.findById(req.body.id)
    if (!user.awaitingPair.includes(req.body.pairer)) {
      user.awaitingPair = [...user.awaitingPair, req.body.pairer]
      await user.save()
      res.status(201).json({ok: true})
    } else {
      res.status(200).json({ok: true})
    }
  } catch (e) {
    console.log(e)
    res.status(500).json()
  }
}
exports.addToNetwork = async (req, res) => {
  try {
    let user = await User.findById(req.body.id)
    let member = await User.findOne({_id: req.body.member})
    if (member?.awaitingPair?.includes(user._id)) {
      member.network = [...member.network, user._id]
      member.awaitingPair?.remove(user._id)
      user.network = [...user.network, member._id]
      await member.save()
      await user.save()
      let list = await User.find({_id: {$in: user.network}})
      return res.status(200).json(list);
    } else {
      return res.status(400).json({ok: false})
    }
  } catch (e) {
    console.log(e)
    res.status(500).json()
  }
}
exports.getUsers = async (req, res, next) => {
  try {
    let result = await User.find();
    if (result) {
      return res.status(200).json(result);
    } else return res.status(400).json({message: 'bad request'});
  } catch (error) {
    return invalidData({
      res, statusCode: 500
    });
  }
}


exports.emailVerification = async (req, res, next) => {
  try {

    req.user.accountVerified = true
    req.user.emailVerificationToken = null
    await req.user.save();

    return res.status(200).json(req.user);

  } catch (error) {
    return invalidData({
      res, statusCode: 500
    })
  }
}
exports.notify = async (req, res) => {
  try {
    let result = await User.updateOne({_id: req.params.id}, {planConfig: {subscriptionActivated: true}})
    if (result) return res.status(200).json(req.user); else return res.status(400);

  } catch (error) {
    return invalidData({
      res, statusCode: 500
    })
  }
}


exports.blockAccount = async (req, res, next) => {
  try {

    let result = await User.findOneAndUpdate({_id: req.body.id}, {
      accountBlocked: req.body.value
    })

    if (result) {
      return res.status(200).json({
        user: req.user
      })
    } else return invalidData({
      res, error: "Something happened when try to block or unlock the account !"
    });
  } catch (e) {
    console.log(e)
    res.status(500).json()
  }
}

exports.signout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()

    res.status(200).send("Logged out")
  } catch (e) {
    invalidData({
      res, statusCode: 500
    });
  }
}

exports.signoutall = async (req, res, next) => {

  try {
    req.user.tokens = []
    await req.user.save()
    res.status(200).send({
      message: "Logged out"
    })
  } catch (e) {
    invalidData({
      res, statusCode: 500
    });
  }
}

exports.forgottenPasswordemailVerification = async (req, res, next) => {
  try {

    const user = await User.checkEmailInUse(req.body.email)
    if (!user) {
      return invalidData({
        res, statusCode: 404, error: 'No email account'
      });
    }


    const token = await user.generateEmailResetToken()


    await sendPasswordResetEmail({
      email: user.email, emailsSubject: 'Password reset', emailText: 'Follow the link to reset your password.This email is valid for the next thirty minutes', token,
    });


    return res.status(200).json("Email sent")

  } catch (e) {
    return invalidData({
      res, statusCode: 500
    });
  }
}

exports.passwordReset = async (req, res, next) => {
  try {


    if (!validator.isStrongPassword(req.body.password, {
      minSymbols: 0
    })) {
      return invalidData({
        res, statusCode: 404, error: 'Password is not strong enough'
      });
    }


    req.user.password = req.body.password;
    req.user.emailResetToken = null

    await req.user.save()

    return res.status(201).json("Password reset")

  } catch (error) {
    return invalidData({
      res, statusCode: 500
    });
  }
}

exports.getProfile = async (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return invalidData({
      res, statusCode: 500
    });
  }
}
exports.getProfilePicture = async (req, res) => {
  try {
    let file = fs.readFileSync('uploads/' + req.params._id + '/profile.png')
    return res.write(file);
  } catch (error) {
    return invalidData({
      res, statusCode: 500
    });
  }
}

exports.updateProfile = async (req, res, next) => {
  try {

    const propertiesArray = ['firstname', 'lastname', 'matricule', 'username'];
    let data = JSON.parse(req.body.user)


    for (const prop of Object.keys(data)) {
      if (!propertiesArray.includes(prop)) {
        delete data[prop]
      }
    }
    propertiesArray.forEach((property) => {
      req.user[property] = data[property];
    });
    req.user.profile = 'https://www.itreportserver.waternels.com/picture/profile/' + req.user._id;
    await req.user.save()

    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error)
    if (error.message.startsWith("User validation")) {
      return invalidData({
        res, statusCode: 400, error: "Invalid data"
      })
    }
    return invalidData({
      res, statusCode: 500,
    });
  }

}

exports.modifyPassword = async (req, res, next) => {
  try {

    const user = await User.findByCredentials(req.user.email, req.body.oldPassword)
    if (!user) {
      return invalidData({
        res, error: 'No user found', statusCode: 404
      })
    }
    if (!validator.equals(req.body.password, req.body.confirmedPassword)) {

      return invalidData({
        res, error: 'Passwords do not match'
      });
    }

    if (!validator.isStrongPassword(req.body.password, {
      minSymbols: 0
    })) {
      return invalidData({
        res, error: 'Password is not strong enough'
      });
    }

    req.user.password = req.body.password;
    await req.user.save()

    return res.status(201).json("Password changed")

  } catch (error) {
    if (error.message.startsWith("User validation")) {
      return invalidData({
        res, statusCode: 400,
      })
    }

    console.log(error)
    return invalidData({
      res, statusCode: 500,
    });
  }
}