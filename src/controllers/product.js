//mongoose model
const Product = require('../models/product');
const {userMessage} = require("./product");
const User = require("../models/user/user");

exports.add = async (req, res) => {
  try {
    let data = req.body
    if (data.owner) {
      let owner = await User.findOne({_id: data.owner})
      if (owner)
        data.ref = (new Date().getTime()).toString(50)
    }
    let result = new Product(data)
    await result.save()
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}


exports.remove = async (req, res) => {
  try {
    let result = await Product.deleteOne({_id: req.body._id})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.update = async (req, res) => {
  try {
    let data = {...req.body}
    delete data._id;
    let result = await Product.findOneAndUpdate({_id: req.body._id}, data)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.get = async (req, res) => {
  try {
    let result = await Product.find()
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}
