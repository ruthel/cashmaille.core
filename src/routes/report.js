const router = require("express").Router();
const {
  createReport, updateReport, getReport, duplicateReport, getAllReports, deleteReport, deleteAllReports, saveDraft,
} = require("../controllers/report")
const PDFParser = require("pdf2json");
const {decode} = require("url-encode-decode");
const fs = require("fs");
const multer = require("multer")
const storage = require("./../helpers/multer")
const uploadStorage = multer({storage: storage})

router.get("/:id", getReport)
router.get("/", getAllReports)
router.post('/pages', uploadStorage.array("file", 10), async (req, res) => {
  try {
    const pdfParser = new PDFParser();
    const pdfParser2 = new PDFParser();
    await pdfParser.loadPDF("./uploads/preface.pdf")
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", async data1 => {
      pdfParser2.on("pdfParser_dataError", errData => console.error(errData.parserError));
      await pdfParser2.loadPDF("./uploads/content.pdf")
      pdfParser2.on("pdfParser_dataReady", data2 => {
        let preface = [], content = []
        if (data1.Pages) {
          preface = data1.Pages?.map((p, page) => {
            let s = decode(p.Texts.map(t => t.R[0].T?.toLowerCase()).join(' '))
            return {
              page: page + 1, preface: true, content: s?.replace(/\s\s+/g, ' ')
            }
          })
          preface.forEach((p, i) => {
            if (p.content.includes('table of', 0)) {
              preface[i].content = preface[i].content.split('s')[0] + 's'
            }
            if (p.content.includes('summary', 0)) {
              preface[i].content = preface[i].content.split('s')[0] + 'summary'
            }
            
          })
        }
        
        if (data2.Pages) {
          content = data2.Pages?.map((p, page) => {
            return {page: page + 1, content: decode(p.Texts.map(t => t.R[0].T?.toLowerCase()).join(''))}
          })
          content.forEach((p, i) => {
            if (p.content.includes('table of', 0)) {
              content[i].content = content[i].content.split('s')[0] + 's'
            }
          })
        }
        
        if (fs.existsSync('./uploads/preface.pdf')) fs.rmSync('./uploads/preface.pdf')
        if (fs.existsSync('./uploads/content.pdf')) fs.rmSync('./uploads/content.pdf')
        
        return res.status(200).json([...preface, ...content])
      });
    })
  } catch (e) {
    console.log(e)
  }
})
router.post("/:id/duplicate", duplicateReport)
router.post("/", createReport)
router.post("/draft", saveDraft)
router.patch("/:id", updateReport)
router.delete("/", deleteAllReports)
router.delete("/:id", deleteReport)


module.exports = router;
