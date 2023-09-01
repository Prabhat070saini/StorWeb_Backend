const Student = require('../models/Student');
const Hostel = require('../models/Hostel');
const User = require('../models/User');
exports.createStudent = async (req, res) => {
    try {

        const { email, room_no, batch, dept, course, HostelName } = req.body;
        const exuser = await User.findOne({ email });
        if (!exuser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const findHostel = await Hostel.findOne({ name: HostelName });
        if (!findHostel) {
            return res.status(404).json({
                success: false,
                message: "hostel not found"
            })
        }
        if (room_no >= findHostel.capacity) {
            return res.status(404).json({
                success: false,
                message: "room number not existing"
            })
        }
        if (!findHostel.vacant) {
            return res.status(404).json({
                success: false,
                message: "room number is excced the capacity limit"
            })
        }

        // 
        // const query = {
        //     roooms: { $in: [room_no] }
        // };
        const HostelDetails = await Hostel.findOne(
            {
                name: HostelName,
                rooms: { $elemMatch: { $eq: room_no } },
            });
        console.log(HostelDetails, "result")
        console.log(findHostel.vacant, "vacant")
        if (HostelDetails) {
            return res.status(404).json({
                success: false,
                message: "room filled"
            })
        }

        console.log("return hone ke bad aya huy")

        const NewStudent = await Student.create({
            HostelName,
            room_no,
            batch,
            dept,
            course
        });
        await User.findOneAndUpdate({ email },
            {
                Student: NewStudent._id
            }, {
            new: true
        })

        console.log(exuser)
        const updatedHostel = await Hostel.findOneAndUpdate(
            { name: HostelName },
            { $push: { rooms: room_no } },

            { new: true }
        )
        await Hostel.findOneAndUpdate(
            { name: HostelName },

            { $push: { NumberOFStudent: exuser._id, } },

            { new: true }
        )
        await Hostel.findOneAndUpdate(
            { name: HostelName },
            { vacant: findHostel.vacant - 1 },
            { new: true }
        )
        // await Hostel.findOne(

        //         name: HostelName,

        //     {
        //         $push: {
        //             rooms: room_no,
        //         },
        //     },
        //     // {
        //     //     $push: {
        //     //         NumberOFStudent: exuser._id,
        //     //     },
        //     // },
        //     // {
        //     //     vacant: vacant - 1,
        //     // },
        //     { new: true }
        // );

        console.log('error checking for')
        return res.status(200).json({
            exuser,
            success: true,
            message: 'Student successfully registered'
        })

    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "while created student",
            error: err
        });
    }
}