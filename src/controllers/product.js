//mongoose model
const Product = require('../models/product');
const User = require("../models/user/user");
const {ObjectId} = require("mongodb");

exports.add = async (req, res) => {
  try {
    let data = {...req.body}
    if (data.owner) {
      let owner = await User.findOne({_id: data.owner})
      if (owner) data.ref = (new Date().getTime()).toString(36)
    }
    let result = new Product({...data})
    result.save().then(doc => {
      return res.status(200).json(doc)
    }, reason => {
      return res.status(400).json(reason)
    })
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

exports.getForSeller = async (req, res) => {
  try {
    let result = await Product.find({owner: new ObjectId(req.body.owner)})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}
