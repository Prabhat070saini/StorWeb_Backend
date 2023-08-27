const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    cms_id: {
        type: Number,
        required: true,
        unique: true
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
    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'hostel'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Student', StudentSchema);