const express = require('express')
const router = express.Router()

const {add, remove, update, exchange} = require("../controllers/transaction");

router.post('/add', add);
router.post('/remove', remove);
router.post('/exchange', exchange);
router.post('/update', update);

module.exports = router;