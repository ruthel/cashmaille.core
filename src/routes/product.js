const express = require('express')
const router = express.Router()

const {add, remove, update, get} = require("../controllers/product");

router.post('/add', add);
router.post('/remove', remove);
router.post('/update', update);
router.get('/', get);

module.exports = router;