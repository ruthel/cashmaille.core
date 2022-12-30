const cloudinary = require('cloudinary').v2;



cloudinary.config({
  cloud_name: process.env.CLOUDINARYCLOUDNAME || 'dt8vbhi3y',
  api_key: process.env.CLOUDINARYAPIKEY || '921266762132626',
  api_secret: process.env.CLOUDINARYSECRET || 'IVvvd28CaS8cPj-WqumqlFXLfUQ',
});


module.exports = cloudinary;