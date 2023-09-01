// Import the required modules
const express = require("express")
const router = express.Router()

const { changePassword, login, signUp, sendOtp } = require('../controllers/Auth');
const { isAdmin, auth, isStudent } = require("../middlewares/auth");
const { createUserStudent } = require('../controllers/createUserStudent')
const { UpdateProfile } = require("../controllers/createProfile")
const { createStudent } = require("../controllers/createStudent");
router.post('/sendotp', sendOtp)
router.post("/Login", login);
router.post("/SignUp", signUp);



// Create a new student api
router.post('/CreateUserStudent', auth, isAdmin, createUserStudent);
router.post("/changepassword", auth, changePassword)
router.post('/CreateStudent', auth, isAdmin, createStudent);



// Update Profile by User
router.put("/updateProfile", auth, UpdateProfile)
module.exports = router