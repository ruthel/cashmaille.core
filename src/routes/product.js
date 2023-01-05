const express = require('express')
const router = express.Router()

const {add, remove, update, getForSeller} = require("../controllers/product");

router.post('/add', add);
router.post('/remove', remove);
router.post('/update', update);
router.post('/seller-list', getForSeller);

module.exports = router;