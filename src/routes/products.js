const express = require('express')
const router = express.Router()

const {add} = require("../controllers/products");

router.get('/', add)

module.exports = router;
