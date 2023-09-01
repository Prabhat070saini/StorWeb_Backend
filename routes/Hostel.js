// Import the required modules
const express = require("express")
const router = express.Router();

const { createHostel } = require("../controllers/createHostel");

const { isAdmin, auth, isStudent } = require("../middlewares/auth");
router.post('/CreateHostel', auth, isAdmin, createHostel);


module.exports = router