const User = require("../models/User");
const OTP = require("../models/Otp");
const Otp_genrator = require("otp-generator");
const bycrpt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/MailSender");
// const passwordUpdated = require("../mail/templates/passwordUpdate")
// Send otp login for signup
exports.sendOtp = async (req, res) => {

    try {
        // extract Email from request
        const { email } = req.body;

        // check if user is alread exsist email
        const CheckUserPresent = await User.findOne({ email });

        // if user exists return response 
        if (CheckUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already exists",
            });
        }
        // Genrate Otp 
        let otp = Otp_genrator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // check unique otp or not
        const result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = Otp_genrator.generate(6, {
                upperCaseAlphabets: false,
            });
        }
        // console.log(`Genrated otp-> ${otp}`);
        // check unique otp or not

        // console.log(`Genrated otp-> ${otp}`);
        // console.log(`inSIDE auth sendopt email: ${email}, otp: ${otp}`)
        const otp_payload = { email, otp };

        // console.log(`after otppalyload`);
        // create an entity in the database
        const otpbody = await OTP.create(otp_payload);
        // console.log(`after create otp`);
        // console.log(otpbody);


        //  retrun response
        return res.status(200).json({
            success: true,
            message: 'otp send successfully',
            otp,
        });
    }
    catch (error) {
        console.log(`otp send error: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'otp send failed',
        });
    }
}


//  signUp Function 
exports.signUp = async (req, res) => {


    try {
        //    fetch data from the req body
        const { firstName, lastName, email, password, confirmPassword, contactNumber, otp, accountType, AgentCode } = req.body;

        // validate email and password
        if (accountType === "Admin" && AgentCode != 25676) {
            return res.status(403).json({
                success: false,
                message: 'Agent code is invalid',
            });
        }

        if (!email || !password || !confirmPassword || !otp || !firstName || !lastName) {
            console.log(firstName, lastName, email, password, confirmPassword, otp, accountType);
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match with confirmed password',
            });
        }
        // check if user is alread exsist email
        const CheckUserPresent = await User.findOne({ email });
        if (CheckUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // find most recently otp 
        if (accountType === "Admin") {
            const recentotp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
            console.log(`recentotp-> ${recentotp}`);

            // validate otp
            if (recentotp.length == 0) {
                // otp not found 
                return res.status(404).json({
                    success: false,
                    message: "otp not found",
                });

            }
            else if (recentotp[0].otp !== otp) {
                return res.status(404).json({
                    success: false,
                    message: "invalid otp",
                });
            }
        }

        // Hash Password
        const Hashedpassword = await bycrpt.hash(password, 10);

        // entry create in database
        const profileDtails = await Profile.create({
            gender: null,
            dob: null,
            about: null,
            contactNumber: null,
            addhress: null,
            fatherName: null,
        });
        console.log('hash password')
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: Hashedpassword,
            accountType,
            additionalDetails: profileDtails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
        console.log(user);
        return res.status(200).json({
            success: true,
            message: `Account Successfully created`,
        })
    }
    catch (error) {
        console.log(`Error while singUp${error}`);
        return res.status(500).json({
            success: false,
            message: `An error occurred while singup Try again later`,
        });


    }
}

// Login 

exports.login = async (req, res) => {
    try {
        //  fetch data from req
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            })
        }
        const user = await User.findOne({ email }).populate("additionalDetails").populate("Student").exec();;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist Please first SingUp',
            });
        }
        // check password and create jwt token
        console.log(`under user: ${user.accountType}`)
        if (await bycrpt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '3h',
                //  "2h",
            });
            user.token = token;
            user.password = undefined;
            // Genrate cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: `Invalid password`,
            });
        }
    }
    catch (error) {
        console.log(`error while logging in: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Loggined failed Try again later`,
        })
    }

}
// change password homework

exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id);

        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate old password
        const isPasswordMatch = await bycrpt.compare(
            oldPassword,
            userDetails.password
        );
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" });
        }

        // Match new password and confirm new password\
        console.log("confirm new password", confirmNewPassword);
        if (newPassword !== confirmNewPassword) {
            // If new password and confirm new password do not match, return a 400 (Bad Request) error
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match",
            });
        }

        // Update password
        const encryptedPassword = await bycrpt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        // Send notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Update your Passwords",


                `Password updated successfully`
            );
            // console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        // Return success response
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};