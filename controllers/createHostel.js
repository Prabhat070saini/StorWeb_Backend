const Hostel = require('../models/Hostel');
const User = require('../models/User');
const Admin = require('../models/Admin');
exports.createHostel = async (req, res) => {
    try {
        const { name, location, capacity } = req.body;
        const exsitHostel = await Hostel.findOne({ name: name });
        const userDetails = await User.findById(req.user.id);
        if (exsitHostel && userDetails) {
            return res.status(500).json({
                success: false,
                message: ` Hostel already exists`,
            });

        }
        if (!capacity || !name || !location) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // for(let i=0;i<capacity.length;i++)
        // {
        //     $push: {
        //         rooms: true,
        //         }
        // }
        const newHostel = await Hostel.create({
            name,
            location,
            capacity,
            vacant: capacity
        });
        console.log(newHostel, "created new hostel");
        await Admin.create({
            Hostel: newHostel._id,
            data: Data.now(),
        });
        return res.status(200).json({
            newHostel,
            success: true,
            message: "New hostel created",
        })

    } catch (error) {
        console.log(`Error while create Hostel${error}`);
        return res.status(500).json({
            success: false,
            message: `An error occurred while creating Hostel`,
        });
    }
}