const express = require('express');
const Faculty = require('../models/faculty');
const router = express.Router();
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuthAccess')



/**
 * Method: GET
 * Action: Fetch All Data
 * Function : Admin
 */

router.get('/get', adminAuth , async (req, res, next) => {
    try {
        const allFaculty = await Faculty.find({});
        const len = allFaculty.length;
        if (!allFaculty) {
            return res.status(404).json({
                success: false,
                msg: "No Data Exist In Database"
            })
        };
        res.status(302).json({
            sucess: true,

            msg: "Students Data Successfully Found",
            length: 'Total Student in database ' + len,
            Data: allFaculty
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

router.get('/getEmail', adminAuth , async (req, res, next) => {
    try {
        let existFaculty = await Faculty.findOne({ email: req.body.email });
        if (!existFaculty) {
            return res.status(401).json({
                success: true,
                msg: 'Unauthorize Email Please Register First'
            });
        }
        res.status(302).json({
            success: true,
            msg: "Faculty Found Successfully",
            data: existFaculty
        });

    } catch (error) {
        console.log(error.messge());
        res.status(404).json({
            success: false,
            error: "Error in Faculty get api"

        })
        next(error);
    }
});



/**
 * Method : POST
 */

router.post('/post', adminAuth, async (req, res, next) => {

    try {

        let faculty = await Faculty.findOne({ email: req.body.email });
        if (faculty) {
            return res.status(208).json({
                success: true,
                message: 'Email already exist'
            })
        }
        let newFaculty = await Faculty.create(req.body);
        await newFaculty.save();
        res.status(201).json({
            success: true,
            msg: "Successfully Faculty Information Store in Database",
            faculty: newFaculty
        })


    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            error: "All Feild are Require"
        })

    };
});


/**
 * Method: UPDATE
 * Ation : UPDATE Single User
 */


router.put('/update/:id', adminAuth, async (req, res, next) => {
    try {
        const existFaculty = await Faculty.findById(req.params.id);

        if (!existFaculty) {
            return res.status(401).json({
                success: true,
                msg: 'No Data Found for Update'
            });
        }
        let updatedFaculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runVaidator: true
        });
        res.status(200).json({
            success: true,
            msg: 'Faculty update sucessfully',
            UpdateFaculty: updatedFaculty
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
        const existFaculty = await Faculty.findOne({
            email: req.body.email
        });
        console.log(existFaculty);

        if (!existFaculty) {
            return res.status(401).json({
                success: true,
                msg: 'No Email Exist For Delete'
            });
        }
        await existFaculty.deleteOne();
        res.status(301).json({
            success: true,
            msg: "Faculty Data Delete Successfully",
            removeData: existFaculty
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



/**
 * Method : DELETE 
 * Action : Delete All Student
 */


router.delete('/delete', adminAuth,async (req, res, next) => {
    try {
        const allFaculty = await Faculty.find({});
        console.log(allFaculty);
        if (!allFaculty) {
            return res.status(401).json({
                success: true,
                msg: 'No Email Exist For Delete'
            });
        }
        await Faculty.deleteMany();
        res.status(301).json({
            success: true,
            msg: "Faculty Data Delete Successfully",
            removeData: allFaculty,
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