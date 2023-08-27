// Import the required modules
const express = require("express")
const router = express.Router()

const { changePassword, login, signUp, sendOtp } = require('../controllers/Auth')
router.post('/sendotp', sendOtp)
router.post("/Login", login);
router.post("/SignUp", signUp);


module.exports = router