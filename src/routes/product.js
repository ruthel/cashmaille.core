const express = require('express')
const router = express.Router()

const {add, remove, update} = require("../controllers/product");
const {get} = require("mongoose");

router.post('/add', add);
router.post('/remove', remove);
router.post('/update', update);
router.get('/', get);

module.exports = router;