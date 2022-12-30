const express = require('express')
const router = express.Router()

const {createCat, getAll, createUrl, getAllUrl, deleteCat, deleteUrl} = require("../controllers/clipboard_category");

router.post('/category/create', createCat);
router.post('/delete', deleteUrl);
router.delete('/category/:category', deleteCat);
router.post('/create', createUrl);
router.get('/all', getAllUrl);
router.get('/category/all', getAll);

module.exports = router;