const mongoose = require('mongoose');
const mailSender = require('../utils/MailSender');
// const emailTemplate = require("../mail/templates/EmailverificationTemplate");
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
        expires: 300000,
    },

});

// a function -> send mail
async function sendVerificationEmail(email, otp) {

    // console.log(`inSIDE OTPMODEL email: ${email}, otp: ${otp}`)
    try {
        // console.log("prbha")
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            otp,
        );
        console.log("Email sent successfully: ", mailResponse);
    }
    catch (err) {
        console.log('error occured while sending email: ', err.message);
        // throw err;
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}
// Define a post-save hook to send email after the document has been saved
otpSchema.pre("save", async function (next) {
    console.log("New document saved to database");

    // Only send an email when a new document is created
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
        // console.log("under if New document saved to database");
    }
    next();
});
module.exports = mongoose.model("Otp", otpSchema);