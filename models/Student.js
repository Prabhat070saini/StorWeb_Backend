const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    HostelName: {
        type: String,
        required: true,
        // unique: true
    },
    room_no: {
        type: Number,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Student', StudentSchema);