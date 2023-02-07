const express = require('express')
const router = express.Router()

const {add, remove, update, exchange, all} = require("../controllers/consumption");

router.post('/add', add);
router.post('/remove', remove);
router.get('/all', all);
router.post('/exchange', exchange);
router.post('/update', update);

module.exports = router;