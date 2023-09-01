const User = require("../models/User");
const Profile = require("../models/Profile");

exports.UpdateProfile = async (req, res) => {
    try {
        const { dateOfBirth, about = "", constactNumber, gender } = req.body;
        const id = req.user.id;
        console.log("user id: " + id);
        console.log("date of birth: " + dateOfBirth)
        if (!dateOfBirth || !about || !gender || !id) {
            console.log(dateOfBirth, about, gender);
            console.log(id)
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userDetails = await User.findById(id);
        console.log(userDetails);
        const profileId = userDetails.additionalDetails;
        console.log(`profileid $`);
        const profileDtails = await Profile.findById(profileId);
        profileDtails.contactNumber = constactNumber;
        profileDtails.gender = gender;
        profileDtails.about = about;
        profileDtails.dob = dateOfBirth;
        console.log(profileDtails);
        await profileDtails.save();
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profileDtails,

        });
    }
    catch (err) {
        console.error("while updating profile", err);
        return res.status(404).json({
            success: false,
            message: err.message,
        })
    }
}
