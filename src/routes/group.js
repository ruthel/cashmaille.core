const express = require('express')
const router = express.Router()

const {add, remove, update, addMember, removeMember, listAll, all} = require("../controllers/group");

router.post('/add', add);
router.post('/addMember', addMember);
router.post('/removeMember', removeMember);
router.post('/remove', remove);
router.post('/update', update);
router.get('/all', all);
router.post('/listAll', listAll);

module.exports = router;