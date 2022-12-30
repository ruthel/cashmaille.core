const express = require('express')
const router = express.Router()

const {send, userMessage, getUserMessage, markAsReadForUser, markAsReadAdm} = require("../controllers/message");

router.post('/', send);
router.get('/user/read', markAsReadForUser);
router.get('/user/:id/read', markAsReadAdm);
router.get('/user/:id', getUserMessage);
router.get('/user', userMessage);

module.exports = router;