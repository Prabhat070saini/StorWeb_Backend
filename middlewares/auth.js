const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


exports.auth = async (req, res, next) => {
    try {
        // Extracting JWT from request cookies, body or header
        const token =
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization").replace("Bearer ", "");;

        // If JWT is missing, return 401 Unauthorized response
        console.log("JWT missing", token);
        if (!token) {
            return res.status(401).json({ success: false, message: `Token Missing` });
        }

        try {
            // Verifying the JWT using the secret key stored in environment variables
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            // Storing the decoded JWT payload in the request object for further use
            req.user = decode;
        } catch (error) {
            // If JWT verification fails, return 401 Unauthorized response
            return res
                .status(401)
                .json({ success: false, message: "token is invalid" });
        }

        // If JWT is valid, move on to the next middleware or request handler
        next();
    } catch (error) {
        // If there is an error during the authentication process, return 401 Unauthorized response
        return res.status(401).json({
            success: false,
            message: `Something Went Wrong While Validating the Token - ${error.message}`,
        });
    }
};


// isstudent


exports.isStudent = async (req, res, next) => {
    try {
        // const { accountType } = req.body;
        // console.log(accountType)
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "You must be a student",
            });
        }
        next();
    }
    catch (error) {
        console.log("while auth isstudent" + error);
        return res.status(401).json({
            success: false,
            message: "something went wrong while verifying isstudent",
        });
    }
}



exports.isAdmin = async (req, res, next) => {
    try {

        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "You must be a Admin",
            });
        }
        next();
    }
    catch (error) {
        console.log("while auth Admin" + error);
        return res.status(401).json({
            success: false,
            message: "something went wrong while verifying Admin ",
        });
    }
}