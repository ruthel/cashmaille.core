const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const cloudinary = require("../../helpers/upload");

const contentObjectSchema = new Schema({
  
  type: {
    type: String,
    trim: true,
    enum: ['P', 'PI', 'TI', 'LI', 'I', 'PC', 'TOC', 'A', 'G', 'F'],
  },
  style: {},
  value: Object,
  file: {
    name: {
      type: String,
    },
    value: {
      type: String,
    },
    public_id: {
      type: String
    }
  }
});

contentObjectSchema.pre('validate', async function (next) {
  const contentObject = this
  
  if (!contentObject.$isEmpty('file') || contentObject.isModified('file.value')) {
    if (!contentObject.type === "I" && contentObject.file.value.startsWith('http')) {
      
      const reportObject = contentObject.ownerDocument();
      
      if (!reportObject.containedImages) {
        reportObject.containedImages = true
      }
      
      const folder = reportObject.storageFolder.imageFolder
      
      const fileName = contentObject.value.value;
      
      const response = await cloudinary.uploader.upload(
        `${contentObject.file.value}`, {
          public_id: `${folder}/${fileName}`,
          resource_type: "image"
        },
      );
      
      contentObject.file.value = response.secure_url;
      contentObject.file.public_id = response.public_id;
    }
    
    
  }
  
  next()
});


contentObjectSchema.pre('remove', async function (next) {
  
  const contentObject = this;
  
  if (!contentObject.$isEmpty('file.public_id')) {
    
    await cloudinary.uploader.destroy(contentObject.file.public_id);
    
  }
  next();
})

module.exports = contentObjectSchema