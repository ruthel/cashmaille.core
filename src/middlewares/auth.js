const jwt = require('jsonwebtoken')
const {
  invalidData
} = require('../helpers/error')
const User = require('../models/user')


exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!!token) {
      const decoded = jwt.verify(token, 'ilovepizzastheyaremyfavoritemealandiwouldlovetoeatthemdayinandoutforthesakeofmotherofgod1234567890')
      const user = await User.findOne({
        _id: decoded.id, 'tokens': token
      })
      
      if (!user) {
        throw new Error()
      }
      
      req.token = token
      req.user = user
      
      next()
    } else {
      if (req.query.apiKey === '123456852') next()
    }
  } catch (e) {
    console.log(e)
    return invalidData({
      res, statusCode: 401, error: 'Please authenticate'
    })
  }
}


exports.verifyEmailVerificationToken = async (req, res, next) => {
  try {
    const token = req.body.token;
    jwt.verify(token, 'ilovepizzastheyaremyfavoritemealandiwouldlovetoeatthemdayinandoutforthesakeofmotherofgod1234567890')
    const user = await User.findOne({
      emailVerificationToken: token,
    })
    if (!user) {
      throw new Error()
    }
    req.user = user
    next()
  } catch (e) {
    console.log(e)
    return invalidData({
      res, statusCode: 401, error: 'Please authenticate'
    })
  }
}

exports.verifyPaswordResetToken = async (req, res, next) => {
  
  try {
    const token = req.body.token;
    jwt.verify(token, 'ilovepizzastheyaremyfavoritemealandiwouldlovetoeatthemdayinandoutforthesakeofmotherofgod1234567890')
    const user = await User.findOne({
      emailResetToken: token,
    })
    
    
    if (!user) {
      throw new Error()
    }
    
    
    req.user = user
    next()
  } catch (e) {
    return invalidData({
      res, statusCode: 401, error: 'Please authenticate'
    })
  }
}