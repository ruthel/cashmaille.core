const Report = require("../models/report/report");
const {invalidData} = require("../helpers/error");
const User = require("../models/user/user");

exports.createReport = async (req, res) => {
  try {
    const userConf = await User.findById(req.user._id)
    if (userConf) {
      const reportCount = await Report.find({owner: userConf._id}).count()
      if (reportCount >= userConf.planConfig.maxDoc) {
        return invalidData({
          res, statusCode: 403
        })
      } else {
        const report = new Report({
          ...req.body, owner: req.user._id
        });
        report.cover.matricule = req.user.matricule;
        await report.save()
        return res.status(201).json(report)
      }
    } else {
      return invalidData({
        res, statusCode: 401
      })
    }
    
  } catch (error) {
    console.log(error)
    return invalidData({
      res, statusCode: 500
    })
  }
}
exports.saveDraft = async (req, res) => {
  try {
    const userConf = await User.updateOne({_id: req.user._id}, {draft: req.body})
    return res.status(200).json(userConf)
  } catch (error) {
    console.log(error)
    return invalidData({
      res, statusCode: 500
    })
  }
}

exports.updateReport = async (req, res, next) => {
  
  try {
    let data = {...req.body}
    data.preface.storageFolder = data.storageFolder
    data.introduction.storageFolder = data.storageFolder
    data.conclusion.storageFolder = data.storageFolder
    data.contentOfWork = data.contentOfWork.map(work => ({...work, storageFolder: data.storageFolder}))
    data.annexes = data.annexes.map(work => ({...work, storageFolder: data.storageFolder}))
    
    const report = await Report.findOneAndUpdate({
      _id: req.params.id, owner: req.user._id
    }, data, {runValidators: true, new: true});
    
    if (!report) {
      return invalidData({
        res, statusCode: 404, error: 'No report found'
      })
    }
    return res.status(200).json(report)
    
  } catch (error) {
    console.log(error)
    if (error.message.startsWith("Report validation")) {
      return invalidData({
        res
      })
    }
    return invalidData({
      res, statusCode: 500
    })
  }
}


exports.getReport = async (req, res, next) => {
  try {
    
    const report = await Report.findOne({
      _id: req.params.id, owner: req.user._id
    });
    
    if (!report) {
      return invalidData({
        res, statusCode: 404
      })
    }
    return res.status(200).json(report);
    
    
  } catch (error) {
    console.log(error)
    return invalidData({
      res, statusCode: 500
    })
  }
}

exports.getAllReports = async (req, res, next) => {
  try {
    let reports = await Report.find({
      owner: req.user._id
    });
    
    if (!reports || !reports.length) {
      return invalidData({
        res, statusCode: 204
      });
    }
    reports = reports.map((report) => report.sendBack())
    return res.status(200).json(reports);
    
  } catch (error) {
    return invalidData({
      res, statusCode: 500
    })
  }
}

exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id, owner: req.user._id
    })
    if (!report) {
      return invalidData({
        res, statusCode: 404, error: 'No report found'
      })
    }
    
    await report.remove()
    return res.status(200).json('Deleted')
  } catch (error) {
    
    console.log(error)
    return invalidData({
      res, statusCode: 500
    })
  }
}

exports.deleteAllReports = async (req, res, next) => {
  try {
    
    const ids = req.body.ids;
    
    if (ids.length) {
      
      const reports = [];
      
      for (id of ids) {
        const report = await Report.findOne({
          _id: id, owner: req.user._id,
        })
        reports.push(report);
      }
      
      
      if (!reports.length) {
        return invalidData({
          res, statusCode: 404, error: 'No reports found'
        });
      }
      
      
      for (const report of reports) {
        
        await report.remove()
      }
      
      return res.status(200).json("Reports deleted")
    }
    
    
    return invalidData({
      res, statusCode: 404, error: 'No reports found'
    });
    
    
  } catch (error) {
    
    return invalidData({
      res, statusCode: 500
    })
  }
}

exports.duplicateReport = async (req, res, next) => {
  try {
    const userConf = await User.findById(req.user._id)
    if (userConf) {
      const reportCount = await Report.find({owner: userConf._id}).count()
      if (reportCount >= userConf.planConfig.maxDoc) {
        return invalidData({
          res, statusCode: 403
        })
      } else {
        let report = await Report.findOne({
          _id: req.params.id, owner: req.user._id
        });
        
        if (!report) {
          return invalidData({
            res, statusCode: 404, error: 'No report found'
          })
        }
        
        report = report.removeId();
        const newReport = new Report({
          ...report, owner: req.user._id
        });
        
        newReport.cover.academicStart = req.body.academicStart;
        newReport.cover.academicEnd = req.body.academicEnd;
        newReport.storageFolder.imageFolder = `it-report/images/${req.user._id}/${newReport.id}`;
        newReport.isDuplicate = true;
        
        await newReport.save();
        return res.status(201).json({id: req.params.id, newReport})
      }
    }
  } catch (error) {
    console.log(error)
    if (error.message.startsWith("Report validation")) {
      return invalidData({
        res
      })
    }
    return invalidData({
      res, statusCode: 500
    })
  }
}