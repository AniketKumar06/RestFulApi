const express = require('express');
const Student = require('../models/student');
const router = express.Router();
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuthAccess')

/**
 * Method: GET
 * Action: Fetch All Data
 * Function :Admin
 */

router.get('/get', adminAuth, async (req, res, next) => {
    try {
        const allStudent = await Student.find({});
        const len = allStudent.length;
        if (!allStudent) {
            return res.status(404).json({
                success: false,
                msg: "No Data Exist In Database"
            })
        };
        res.status(200).json({
            sucess: true,

            msg: "Students Data Successfully Found",
            length: 'Total Student in database ' + len,
            Data: allStudent
        });
    } catch (error) {
        console.log("Server or Database Error");
        res.status(404).json({
            success: false,
            error: "Error in Student get api"
        });
        next(error);
    }
});



/**
 * Method : GET
 */

router.get('/getEmail', adminAuth, async (req, res, next) => {
    try {
        let existStudent = await Student.findOne({ email: req.body.email });
        if (!existStudent) {
            return res.status(401).json({
                success: true,
                msg: 'Unauthorize Email Please Register First'
            });
        }
        res.status(200).json({
            success: true,
            msg: "Student Found Successfully",
            data: existStudent
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            error: "Error in Student get api"
        });
        next(error);
    }
});



/**
 * Method : POST
 */

router.post('/post', adminAuth, async (req, res, next) => {

    try {

        let student = await Student.findOne({ email: req.body.email });
        if (student) {
            return res.status(208).json({
                success: true,
                message: 'Email already exist'
            })
        }
        let newStudent = await Student.create(req.body);
        await newStudent.save();
        res.status(201).json({
            success: true,
            msg: "Successfully Student Information Store in Database",
            student: newStudent
        })


    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            error: "All Feild are Require"
        });
        next(error);

    };
});

/**
 * Method: UPDATE
 * Ation : UPDATE Single User
 */

router.put('/update/:id', adminAuth, async (req, res, next) => {
    try {
        const existStudent = await Student.findById(req.params.id);

        if (!existStudent) {
            return res.status(401).json({
                success: true,
                msg: 'No Data Found for Update'
            });
        }
        let updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runVaidator: true
        });
        res.status(200).json({
            success: true,
            msg: 'Student update sucessfully',
            UpdateStudent: updatedStudent
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "Server Error"
        });
        next(err);

    }
});




/**
 * Method: DELETE
 * Ation : Delete Single User
 */

router.delete('/deleteEmail', adminAuth, async (req, res, next) => {
    try {
        const existStudent = await Student.findOne({
            email: req.body.email
        });
        console.log(existStudent);
        if (!existStudent) {
            return res.status(401).json({
                success: true,
                msg: 'No Email Exist For Delete'
            });
        }
        await existStudent.deleteOne();
        res.status(301).json({
            success: true,
            msg: "Student Data Delete Successfully",
            removeData: existStudent
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
});



/**
 * Method : DELETE 
 * Action : Delete All Student
 */


router.delete('/detele', adminAuth, async (req, res, next) => {
    try {
        const allStudent = await Student.find({});
        console.log(allStudent);
        if (!allStudent) {
            return res.status(401).json({
                success: true,
                msg: 'No Email Exist For Delete'
            });
        }
        await Student.deleteMany();
        res.status(301).json({
            success: true,
            msg: "Student Data Delete Successfully",
            removeData: allStudent,
            studentData: {}
        });
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            success: false,
            error: "Server Error"
        });
    }
});


module.exports = router;