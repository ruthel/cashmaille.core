//mongoose model
const Product = require('../models/product');
const {userMessage} = require("./product");

exports.add = async (req, res) => {
  try {
    let result = new Product({})
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
    let result = await Product.updateOne({_id: req.body._id}, data)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}
