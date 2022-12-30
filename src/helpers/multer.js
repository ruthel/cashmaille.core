const multer = require("multer")
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("uploads/" + req.user._id + "/"))
      fs.mkdirSync("uploads/" + req.user._id + "/")
    cb(null, "uploads/" + req.user._id + "/")
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname + '.' + file.mimetype?.split('/')[1])
    cb(null, 'profile.' + file.mimetype?.split('/')[1])
  },
})

module.exports = storage