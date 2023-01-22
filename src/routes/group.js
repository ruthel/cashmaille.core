const express = require('express')
const router = express.Router()

const {add, remove, update} = require("../controllers/group");

router.post('/add', add);
router.post('/remove', remove);
router.post('/update', update);

module.exports = router;