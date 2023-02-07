const express = require('express')
const router = express.Router()

const {add, remove, update, getForSeller, all} = require("../controllers/product");

router.post('/add', add);
router.post('/remove', remove);
router.post('/update', update);
router.get('/all', all);
router.post('/seller-list', getForSeller);

module.exports = router;