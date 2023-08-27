const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {

        type: String,
        required: true,
        trim: true,
    }
    , lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,

    },
    accountType: {
        type: String,
        enum: ['Admin', 'Student'],
        required: true,
    },
    image: {
        type: String,
        required: true,

    },
    reSetPasswordExpires: {
        type: Date,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },
    Student: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Student",
    },
    Admin: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Admin",
    }
})
module.exports = mongoose.model("User", userSchema)