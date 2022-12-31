const express = require('express')
const router = express.Router()

const {
  signIn,
  signout,
  signoutall,
  signUp,
  forgottenPasswordemailVerification,
  passwordReset,
  emailVerification,
  getProfile,
  updateProfile,
  modifyPassword,
  getUsers,
  notify,
  blockAccount, getProfilePicture, searchForUser, awaitingPair
} = require("../controllers/user");
const {
  auth,
  verifyPaswordResetToken,
  verifyEmailVerificationToken
} = require("../middlewares/auth");

const multer = require("multer")
const storage = require("./../helpers/multer")
const uploadStorage = multer({storage: storage})

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/searchcode', searchForUser);
router.post('/awaitingPair', awaitingPair);

router.post('/notify-payment/:id', notify);
router.post('/signout', auth, signout);
router.patch('/users/block', blockAccount);
router.post('/signoutall', auth, signoutall);
router.post('/emailverification', verifyEmailVerificationToken, emailVerification);
router.post('/forgottenpasswordemailverification', forgottenPasswordemailVerification);
router.post('/passwordreset', verifyPaswordResetToken, passwordReset);
router.get('/me', auth, getProfile);
router.get('/picture/profile/:_id', getProfilePicture);
router.get('/users', getUsers);
// router.get('/users', auth, getUsers);
router.patch('/me', auth, uploadStorage.array("file", 1), updateProfile);
router.post('/modifypassword', auth, modifyPassword);

module.exports = router;