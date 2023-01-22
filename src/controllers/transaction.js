const Transaction = require("../models/transaction");
const {ObjectId} = require("mongodb");
const User = require("../models/user");

exports.add = async (req, res) => {
  try {
    let result = new Transaction({...req.body})
    let user = await User.findById(req.body.owner);
    user.balance += req.body.amount;
    result.save().then(async doc => {
      await user.save()
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
    let result = await Transaction.deleteOne({_id: req.body._id})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.update = async (req, res) => {
  try {
    let data = {...req.body}
    delete data._id;
    let result = await Transaction.findOneAndUpdate({_id: req.body._id}, data)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}
