const Consumption = require("../models/consumption");
const Transaction = require("../models/transaction");
const User = require("../models/user");

exports.add = async (req, res) => {
  try {
    let result = new Consumption({...req.body})
    let user = await User.findById(req.body.owner);
    user.balance += parseInt(req.body.amount);
    user.balanceExpiryDate = new Date();
    result.save().then(async doc => {
      await new Transaction({owner: req.body.owner, amount: req.body.amount}).save()
      await user.save()
      return res.status(200).json(doc)
    }, reason => {
      return res.status(400).json(reason)
    })
  } catch (e) {
    return res.status(500)
  }
}

exports.exchange = async (req, res) => {
  try {
    let result = new Consumption({...req.body})
    if (!!req.body.sender && !!req.body.owner) {
      let sender = await User.findById(req.body.sender);
      let owner = await User.findById(req.body.owner);
      owner.balance += parseInt(req.body.amount);
      console.log(owner)
      sender.balance -= parseInt(req.body.amount);
      console.log(sender)
      result.save().then(async doc => {
        await owner.save()
        await sender.save()
        return res.status(200).json(doc)
      }, reason => {
        return res.status(400).json(reason)
      })
    }
  } catch (e) {
    return res.status(500)
  }
}

exports.remove = async (req, res) => {
  try {
    let result = await Consumption.deleteOne({_id: req.body._id})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.all = async (req, res) => {
  try {
    let result = await Consumption.find()
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.update = async (req, res) => {
  try {
    let data = {...req.body}
    delete data._id;
    let result = await Consumption.findOneAndUpdate({_id: req.body._id}, data)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}
