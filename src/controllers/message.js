//mongoose model
const Message = require('../models/message');
const {userMessage} = require("./message");

exports.userMessage = async (req, res) => {
  try {
    let result = await Message.find({$or: [{owner: req.user._id}, {to: req.user._id}]})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.send = async (req, res) => {
  let message = new Message({owner: req.user?._id, ...req.body})
  message.save().then(async () => {
    let list = await Message.find({$or: [{owner: req.body.to}, {to: req.body.to}]})
    return res.status(201).json(list)
  })
}


exports.markAsReadForUser = async (req, res) => {
  try {
    await Message.updateMany({to: req.user._id}, {isRead: true});
    let result = await Message.find({$or: [{owner: req.user._id}, {to: req.user._id}]})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.getUserMessage = async (req, res) => {
  try {
    let result = await Message.find({$or: [{owner: req.params.id}, {to: req.params.id}]})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.markAsReadAdm = async (req, res) => {
  try {
    let ok = await Message.updateMany({owner: req.params.id}, {isRead: true})
    let result = await Message.find({$or: [{owner: req.params.id}, {to: req.params.id}]})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}
