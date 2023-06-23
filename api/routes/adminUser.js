const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const bcryptjs = require('bcryptjs');
const adminUesr = require('../models/adminUser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({
    path: '../../config/config.env'
})




/**
 * Method: POST
 * Action :Signup
 */


router.post('/signup', async (req, res, next) => {
    const { firstName, lastName, email, phone, password, conformPassword, role, gender } = req.body;
    try {
        const existUser = await adminUesr.findOne({
            email: email,

        });

        if (existUser) {
            return res.status(302).json({
                success: true,
                message: "user already exists"

            })
        }

        else {
            var isMatchPassword = (password === conformPassword);
            if (!isMatchPassword) {
                return res.status(402).json({
                    success: true,
                    error: 'password does not match'
                });
            }
            else {
                bcryptjs.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(404).json({
                            success: true,
                            msg: err.message
                        })
                    }

                    let newAdminUser = new adminUesr({
                        _id: new mongoose.Types.ObjectId,
                        firstName: firstName,
                        lastName: lastName,
                        email: email.toLowerCase(),
                        phone: phone,
                        password: hash,
                        role: role,
                        gender: gender
                    });
                    // console.log("new user", newAdminUser);

                    newAdminUser.save()
                        .then((result) => {
                            res.status(201).json({
                                success: true,
                                msg: "User Register Successfully",
                                data: result
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                success: false,
                                msg: "User Register Failed!"
                            })
                        });
                });
            }
        }

    } catch (error) {
        res.json(500).json({
            success: false,
            msg: "Server Failed"
        })
    }
});



/**
 * Method: POST
 * Action :Signin
 */


router.post('/signin', async (req, res, next) => {
    const { firstName, lastName, email, phone, password, role, gender } = req.body;
    const name = firstName + ' ' + lastName;
    const smallEmail = email.toLowerCase();
    try {
        const existUser = await adminUesr.findOne({
            email: smallEmail
// 
        });

        if (!existUser) {
            return res.status(402).json({
                success: true,
                message: "No User Exist!!"

            });
        }
        else {
            bcryptjs.compare(req.body.password, existUser.password, (err, result) => {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        msg: "Server Error"
                    });

                }
                if (result) {
                    // create Token
                    const payload = {
                        existUser: {
                            id: existUser._id,
                            name: `${existUser.firstName} ${existUser.lastName}`,
                            email: existUser.email,
                            phone: existUser.phone,
                            role: existUser.role,
                            gender: existUser.gender
                        }
                    };
                    jwt.sign(payload, process.env.JWTTOKENKEY, {
                        expiresIn: '24h'
                    }, (err, token) => {
                        if (err) {
                            res.status(404).json({
                                success: false,
                                error: "Anuthorized Person"
                            });
                        }
                        existUser.token = token;
                        res.status(200).json({
                            success: true,
                            message: "Login Successfully !!",
                            token: token
                        })

                    })

                } else {
                    return res.status(404).json({ success: false, message: 'passwords do not match' });
                }

            });
        }
    }
    catch (err) {
        res.json(500).json({
            success: false,
            msg: "Server Failed"
        })
    }
});

module.exports = router;