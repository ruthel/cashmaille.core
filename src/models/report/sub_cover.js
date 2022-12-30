const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const cloudinary = require("../../helpers/upload");


const coverImagesSchema = new Schema({
  
  name: {
    type: String,
  },
  value: {
    type: String,
  },
  public_id: {
    type: String
  }
  
});

coverImagesSchema.pre('save', async function (next) {
  const coverImagesObject = this;
  
  
  if (coverImagesObject.isModified('value')) {
    if (!coverImagesObject.value.startsWith('http')) {
      
      const reportObject = coverImagesObject.ownerDocument();
      
      if (!reportObject.containedImages) {
        reportObject.containedImages = true
      }
      
      const folder = reportObject.storageFolder.imageFolder
      
      
      const fileName = coverImagesObject.name;
      
      // const response = await cloudinary.uploader.upload(
      //     `data:image/png;base64,${coverImagesObject.value}`, {
      //         public_id: `${folder}/${fileName}`,
      //         resource_type: "image"
      //     },
      // );
      //
      //
      // coverImagesObject.value = response.secure_url;
      // coverImagesObject.public_id = response.public_id;
    }
  }
  
  next()
});

coverImagesSchema.pre('remove', async function (next) {
  
  const coverObject = this;
  
  if (!coverObject.$isEmpty('public_id')) {
    
    await cloudinary.uploader.destroy(coverObject.public_id);
    
  }
  
  
  next();
})


const coverSchema = new Schema({
  nameOfSchool: {
    type: Object,
  },
  topic: {
    type: Object,
  },
  matricule: {
    type: Object,
  },
  purpose: {
    type: Object
  },
  logo: {
    type: Object
  },
  academicYear: {
    style: Object,
    start: {
      type: Number,
      required: true,
      min: [2000, 'Cant be valid'],
      max: [2100, 'Cant be valid'],
    },
    end: {
      type: Number,
      required: true,
      min: [2000, 'Cant be valid'],
      max: [2100, 'Cant be valid'],
    },
  },
  objective: {
    type: Object
  },
  academicSupervisor: {
    type: Object
  },
  professionalSupervisor: {
    type: Object
  },
  images: [coverImagesSchema]
});


module.exports = coverSchema