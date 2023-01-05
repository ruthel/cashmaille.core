const express = require('express')
const router = express.Router()

const {add} = require("../controllers/product");

router.post('/', add);

module.exports = router;