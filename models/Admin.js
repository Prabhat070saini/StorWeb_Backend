const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({


    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'hostel'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Admin', AdminSchema);