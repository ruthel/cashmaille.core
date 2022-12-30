const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cloudinary = require("../../helpers/upload")
const coverSchema = require("./sub_cover");
const prefaceSchema = require("./sub_preface");
const contentObjectSchema = require("./sub_elements");
const introductionSchema = require("./sub_introduction");
const conclusionSchema = require("./sub_conclusion");
const tocSchema = require("./sub_toc");


const reportSchema = new Schema({
  projectType: {
    type: String,
    enum: [
      'hnd_tutorial', 'hnd_defense',
      'bachelor_tutorial', 'bachelor_defense', 'master_defense',
    ],
  },
  description: {
    type: String,
  },
  cover: {
    type: coverSchema,
  },
  preface: [{
    type: prefaceSchema,
  }],
  introduction: {
    type: introductionSchema
  },
  conclusion: {
    type: conclusionSchema
  },
  toc: {
    type: tocSchema
  },
  contentOfWork: [{
    title: {
      type: String,
      minlength: [5, 'Title of this section is too small'],
      maxlength: [1000, 'Title of this section is too long']
    },
    type: {
      type: String,
      enum: ['word', 'roman', 'normal']
    },
    description: {
      type: String,
      maxlength: [1000, 'Description of this section is too big']
    },
    storageFolder: {
      imageFolder: {
        required: true,
        type: String,
        default: function () {
          return `it-report/images/${this.owner}/${this.id}`
        }
      }
    },
    style: {
      type: Object,
      required: false,
    },
    body: [{
      title: {
        type: String,
        minlength: [5, 'Title of this section is too small'],
        maxlength: [1000, 'Title of this section is too small']
      },
      description: {
        type: String,
        maxlength: [1000, 'Description of this section is too big']
      },
      style: {
        type: Object,
        required: false,
      },
      border: {
        type: Number,
        required: false,
      },
      type: {
        type: String,
        enum: ['word', 'roman', 'normal']
      },
      content: [{
        type: contentObjectSchema
      }],
    },]
  }],
  annexes: [{
    title: {
      type: String,
      minlength: [5, 'Title of this section is too small'],
      maxlength: [1000, 'Title of this section is too small']
    },
    description: {
      type: String,
      maxlength: [1000, 'Description of this section is too big']
    },
    type: {
      type: String,
      enum: ['word', 'roman', 'normal']
    },
    fixed: {
      type: Boolean,
    },
    content: [{
      type: contentObjectSchema
    },],
    storageFolder: {
      imageFolder: {
        required: true,
        type: String,
        default: function () {
          return `it-report/images/${this.owner}/${this.id}`
        }
      }
    },
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  storageFolder: {
    imageFolder: {
      required: true,
      type: String,
      default: function () {
        return `it-report/images/${this.owner}/${this.id}`
      }
    }
  },
  isDuplicate: {
    type: Boolean,
    default: false,
  },
  containedImages: {
    type: Boolean,
    default: false,
  }
  
}, {
  timestamps: true,
});

reportSchema.methods.sendBack = function () {
  const report = this;
  const reportObject = report.toObject()
  
  const {
    academicStart,
    academicSupervisor,
    professionalSupervisor
  } = reportObject.cover;
  delete reportObject.cover;
  delete reportObject.preface;
  delete reportObject.introduction.content;
  delete reportObject.contentOfWork;
  delete reportObject.conclusion;
  delete reportObject.containedImages;
  
  
  reportObject.academicStart = academicStart;
  reportObject.academicSupervisor = academicSupervisor;
  reportObject.professionalSupervisor = professionalSupervisor
  return reportObject;
}

reportSchema.methods.removeId = function () {
  const report = this;
  
  const reportObject = report.toObject();
  
  delete reportObject._id;
  
  return reportObject;
}

reportSchema.pre('findOneAndUpdate', async function (next) {
  const contentObject = this
  next()
});


reportSchema.pre('remove', async function () {
  const reportObject = this;
  
  if (reportObject.containedImages) {
    try {
      await cloudinary.api.delete_folder(reportObject.storageFolder.imageFolder);
    } catch (e) {
      console.log('Cannot delete folder because not exist')
    }
  }
  
})


const Report = mongoose.model('Report', reportSchema,);

module.exports = Report;


//TODO
//1 List of abreviations to add in report object listOfAbbreviations //Done
//2 Identification slip to add in report object identificationSlip //Done
//3 objective to add in the cover schema //Done
//4 bibliography to add in report object //Done
//5 appendices to add in report object //Done
//6 Table schema an object that has a property title String content an array of objects {key , value ,cols : [{key , value}]} to add to report schema //DONE by implication
//7 Add user profile picture