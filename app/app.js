
const express = require('express');
const connectDB = require('../config/db');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const studentRoutes = require('../api/routes/student');
const facultyRoutes = require('../api/routes/faculty');
const adminUserRoutes = require('../api/routes/adminUser');


const app = express();
app.use(morgan('dev'));
connectDB();

// app.use(express.json());
// app.use(express.json({
//     extended: true
// }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/adminUser', adminUserRoutes);
// app.use((req, res, next) => {
//     res.status(200).json({
//         msg: "hello World"
//     })
// })



// Error Handling

app.use(async (req, res, next) => {

    res.status(404).json({
        success: false,
        error: "bad response"
    });
});

module.exports = app;