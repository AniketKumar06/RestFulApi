const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
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

    },
    address: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("Faculty", facultySchema);