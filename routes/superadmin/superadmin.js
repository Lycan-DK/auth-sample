var express = require('express');
var router = express.Router();
var SuperAd = require('../../models/superAdmin');
var nodemailer = require('../../lib/nodemailer');
var Token = require('../../models/token');
// nodemailerfn(data.OTP,verifyemail.email,"OTP For Forget password")
// var passwordValidator = require('password-validator');
var jwt = require('jsonwebtoken');
var otpVerification = require('../../lib/otpverification.js');
var upload = require('../../lib/awsimageupload.js');
var Auth = require('../../accessControl/accessControl');
var Agency = require('../../models/agencytable')



router.post('/login', async (req, res) => {
    try{
        var data = req.body;
        if(!data.password|| data.password== null){
            return res.status(404).json({message: "Please enter password", data:{} , error:{}})
        }
        var hashedPassword = require('crypto').createHash('sha256').update(data.password).digest('hex');
        SuperAd.findByName(data.name,(err,resdata)=>{
            if(err|| resdata == null){
                return res.status(400).json({message: "No registerd email found by that email", data:{} , error:{}});
            }
            else{
                if(hashedPassword === resdata.password){
                    var createtoken={
                        userid : resdata._id,
                        role:     'Super_Admin_ZAP911' ,
                        token:jwt.sign(
                            {
                                email:resdata.password,
                                userid:resdata._id,
                                date: new Date()
                            },
                            'secret',
                            {
                                expiresIn: "90d"
                            }
                        )
                    }
                    console.log(createtoken)
                    Token.createToken(createtoken,(err,tdata)=>{
                        console.log(tdata);
                        if(err|| tdata == null){
                            return res.status(500).json({message: "Not able to generate Token", data:{} , error:err});
                        }else{
                            return res.json({message: "You are Logged in now", data:{tokenData:createtoken, userDate:resdata } , error:{}})
                        }
                    })
                }
                else{
                    return res.status(401).json({message: "Wrong Password!", data:{} , error:{}})
                }
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});

router.get('/logout', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
        console.log(verifydata);
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var mytoken =  await Token.logout(verifydata);
        console.log(mytoken);
        return res.json({"message":"User Logged out","data":{},error:{}});
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});


router.post('/addagency', async (req, res) => {
    try{
        var data = req.body;
        var verifydata = await Auth.userAuth(req.headers)
        console.log(verifydata);
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        Agency.addAgency(data,(err,resdata)=>{
            if(err|| resdata == null){
                return res.status(500).json({message: "Not able to generate Token", data:{} , error:err});
            }else{
                return res.json({message: "Agency Created", data:resdata , error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});


router.get('/getagency', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
        console.log(verifydata);
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        Agency.getAgency((err,resdata)=>{
            if(err|| resdata == null){
                return res.status(500).json({message: "Not able to generate Token", data:{} , error:err});
            }else{
                return res.json({message: "Agency List", data:resdata , error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

router.post('/changeroleagency', async (req, res) => {
    try{
        var data = req.body;
        var verifydata = await Auth.userAuth(req.headers)
        console.log(data);
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        Agency.changeRole(data,(err,resdata)=>{
            if(err|| resdata == null){
                return res.status(500).json({message: "Not able to generate Token", data:{} , error:err});
            }else{
                return res.json({message: "role changed", data:resdata , error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});


module.exports = router;
