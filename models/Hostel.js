const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HostelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    rooms: [{
        type: Number,

    }],
    capacity: {
        type: Number,
        required: true
    },
    vacant: {
        type: Number,
        required: true
    },
    NumberOFStudent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = Hostel = mongoose.model('Hostel', HostelSchema);