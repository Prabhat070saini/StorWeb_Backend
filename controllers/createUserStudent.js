const User = require('../models/User');
const Student = require('../models/Student');
const bycrpt = require("bcrypt");
const Profile = require('../models/Profile');
const Hostel = require('../models/Hostel');
exports.createUserStudent = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const CheckUserPresent = await User.findOne({ email });
        if (CheckUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const Hashedpassword = await bycrpt.hash(password, 10);
        const profileDtails = await Profile.create({
            gender: null,
            dob: null,
            about: null,
            contactNumber: null,
            addhress: null,
            fatherName: null,
        });

        // const findroomavailable = await Hostel.findOne({ rooms :room_no});
        // if(findroomavailable)
        // {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please Select another room are not available",
        //     });
        // }

        // const NewStudent = await Student.create({
        //     HostelName,
        //     room_no,
        //     batch,
        //     dept,
        //     course
        // });
        const StudentUser = await User.create({
            firstName,
            lastName,
            email,
            password: Hashedpassword,
            accountType: "Student",
            additionalDetails: profileDtails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            // Student: NewStudent._id
        });
        console.log(StudentUser);
        return res.status(200).json({
            success: true,
            message: `Student Account Successfully created`,
        })
    } catch (err) {
        console.log(`Error while create Student${err}`);
        return res.status(500).json({
            success: false,
            message: `An error occurred while creaed Student`,
        });


    }
}