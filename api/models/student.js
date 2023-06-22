const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true

    },
    gender: {
        type: String,
        require: true

    },
    email: {
        type: String,
        require: true,
        unique: true

    },
    phone: {
        type: Number,
        require: true

    }, address: {
        type: String,
        require: true
    }
});


module.exports = mongoose.model('Student', studentSchema);