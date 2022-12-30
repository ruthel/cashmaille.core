const ClipCategory = require("../models/clipboard/category");
const ClipUrl = require("../models/clipboard/item");
const {invalidData} = require("../helpers/error");


exports.createCat = async (req, res, next) => {
  try {
    const clipCategory = new ClipCategory(req.body);
    clipCategory.save().then(doc => {
      return res.status(201).json(doc)
    }, er => {
      console.log(er)
    })
  } catch (error) {
    console.log(error)
    return invalidData({
      res,
      statusCode: 500
    })
  }
}
exports.deleteCat = async (req, res) => {
  try {
    const clipCategory = await ClipCategory.findOneAndDelete({_id: req.params.category});
    return res.status(200).json(clipCategory)
  } catch (error) {
    console.log(error)
    return invalidData({
      res,
      statusCode: 500
    })
  }
}
exports.deleteUrl = async (req, res) => {
  try {
    let r = await ClipUrl.findOneAndDelete({_id: req.body.uri})
    return res.status(200).json(r)
  } catch (error) {
    console.log(error)
    return invalidData({
      res,
      statusCode: 500
    })
  }
}
exports.createUrl = async (req, res) => {
  try {
    const clipUrl = new ClipUrl({name: req.body.name, url: req.body.link, category: req.body.category});
    clipUrl.save().then(async doc => {
      let cat = await ClipCategory.findOne({_id: req.body.category});
      cat.urls.push(doc._id)
      await cat.save()
      return res.status(201).json(doc)
    }, er => {
      console.log(er)
    })
  } catch (error) {
    console.log(error)
    return invalidData({
      res,
      statusCode: 500
    })
  }
}
exports.getAllUrl = async (req, res, next) => {
  try {
    const clipUrls = await ClipUrl.find();
    return res.status(200).json(clipUrls)
  } catch (error) {
    console.log(error)
    return invalidData({
      res,
      statusCode: 500
    })
  }
}
exports.getAll = async (req, res, next) => {
  try {
    ClipCategory.find().populate('urls').then(all => {
      return res.status(200).json(all)
    }, err => {
      return res.status(400).json({message: 'Bad request !'})
    });
  } catch (error) {
    console.log(error)
    return invalidData({
      res,
      statusCode: 500
    })
  }
}
