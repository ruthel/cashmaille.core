const Group = require("../models/group");
const {ObjectId} = require("mongodb");

exports.add = async (req, res) => {
  try {
    let result = new Group({...req.body})
    result.save().then(doc => {
      return res.status(200).json(doc)
    }, reason => {
      return res.status(400).json(reason)
    })
  } catch (e) {
    return res.status(500)
  }
}

exports.addMember = async (req, res) => {
  try {
    let result = await Group.updateOne({_id: req.body._id}, {$push: {members: req.body.memeber}})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.removeMember = async (req, res) => {
  try {
    let result = await Group.updateOne({_id: req.body._id}, {$pull: {members: req.body.memeber}})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}


exports.remove = async (req, res) => {
  try {
    let result = await Group.deleteOne({_id: req.body._id})
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}

exports.update = async (req, res) => {
  try {
    let data = {...req.body}
    delete data._id;
    let result = await Group.findOneAndUpdate({_id: req.body._id}, data)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500)
  }
}
