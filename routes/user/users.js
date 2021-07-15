var express = require('express');
var router = express.Router();
var User = require('../../models/usertable.js');
var tempUser = require('../../models/tempusertable.js');
var nodemailer = require('../../lib/nodemailer');
var Token = require('../../models/token');
// nodemailerfn(data.OTP,verifyemail.email,"OTP For Forget password")
// var passwordValidator = require('password-validator');
var jwt = require('jsonwebtoken');
var otpVerification = require('../../lib/otpverification.js');
var upload = require('../../lib/awsimageupload.js');
var Auth = require('../../accessControl/accessControl');
// get all users  remove it later ...//

// token: jwt.sign(
//     {
//         email:data.email,
//         userId:data.mobileNumber
//     },
//     'secret',
//     {
//         expiresIn: "2h"
//     }
// )



router.get('/', async (req, res) => {
   try {    
        var fname = 1
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        User.getUsers((err, user) => {
            if(err || user.length == 0){
            return res.status(400).json({"message":"No users in database","error": err});
            } else{ return res.status(200).json(user);}
        });
    }
    catch(err){
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});

//user registration
router.post('/register', async (req, res) => {
    try{
            var data = req.body;
            console.log(data)
            if(!data.name){
                return res.status(400).json({message: "There is no user name", data:{} , error:{}});
            };
            if(!data.email){
                return res.status(400).json({message: "There is no user email", data:{} , error:{}});
            };
            if(!data.mobileNumber){
                return res.status(400).json({message: "There is no user mobile number", data:{} , error:{}});
            };
            if(!data.password){
                return res.status(400).json({message: "please enter password", data:{} , error:{}});
            };
            var userc =  await User.findOne({email:data.email});
            if(userc != null){
                return res.status(400).json({message: "User with that email already exist", data:{} , error:{}});
            }else{
                var hashedPassword = require('crypto').createHash('sha256').update(data.password).digest('hex');
                data.password = hashedPassword;
                data.OTP = Math.floor(Math.random() * (1000000 - 100000)) + 100000;
                User.addUser(data, async (err, user) => {
                    if(err){
                        return res.status(400).json({message: "failed to register user", data:{} , error:err});
                    } else{
                        var subject = "Welcome TO Zap911! User account verification Code for ZAP911";
                        nodemailer.nodemailerfn(data.OTP,user.email,subject);
                        return res.json({message: "User Registerd", data:{} , error:{}})
                    }
                });
            }
    }
    catch(err){
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});

router.post('/activate', async (req, res) => {
    try{
        var data = req.body;
        User.activateUser(data,(err,resdata)=>{
            if(err|| resdata == null){
                User.counterActivateUser(data,(err,cbdata)=>{})
                return res.status(400).json({message: "Wrong OTP for the user email", data:{} , error:{}});
            }else{
                return res.json({message: "User Account Activated", data:resdata , error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});

router.post('/resendverifymail', async (req, res) => {
    try{
        var data = req.body;
        data.OTP = Math.floor(Math.random() * (1000000 - 100000)) + 100000;
        User.sendverifymail(data,(err,resdata)=>{
            if(err|| resdata == null){
                return res.status(400).json({message: "No registerd email found by that email", data:{} , error:{}});
            }else{
                var subject = "User account verification code for ZAP911";
                nodemailer.nodemailerfn(data.OTP,user.email,subject);
                return res.json({message: "Please check your email for verification code", data:resdata , error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});

//login api phone number screen 1st screen to check if user is registerd or not 
router.post('/login', async (req, res) => {
    try{
        var data = req.body;
        // 3 scenerios for login one user account activated , registerd and not found
        User.findByEmail(data.email,(err,resdata)=>{
            if(err||resdata== null){
                return res.status(400).json({message: "No registerd email found by that email", data:{} , error:{}});
            }else{
                if(resdata.accountStatus ==="Registerd"){
                    return res.json({message: "Please Verify your account", data:{} , error:{}});
                    // forward him to verify OTP screen
                }
                if(resdata.accountStatus ==="Deactivated"){
                    return res.json({message: "Your Account is deactivated. Please activate your account to Login.", data:{} , error:{}});
                }else{
                    // var createtoken={
                    //     userId : resdata._id,
                    //     token:jwt.sign(
                    //         {
                    //             email:resdata.email,
                    //             userId:resdata._id,
                    //             date: new Date()
                    //         },
                    //         'secret',
                    //         {
                    //             expiresIn: "60d"
                    //         }
                    //     )
                    // }
                    // Token.createToken(createtoken,(err,data)=>{})
                    return res.json({message: "Please enter password to Login", data:{} , error:{}});
                }
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});


//login api password screen
router.post('/password', async (req, res) => {
    try{
        var data = req.body;
        if(!data.password|| data.password== null){
            return res.status(404).json({message: "Please enter password", data:{} , error:{}})
        }
        var hashedPassword = require('crypto').createHash('sha256').update(data.password).digest('hex');
        User.findByEmail(data.email,async (err,resdata)=>{
            if(err|| resdata == null){
                return res.status(400).json({message: "No registerd email found by that email", data:{} , error:{}});
            }
            else{
                if(hashedPassword === resdata.password){
                    var createtoken={
                        userid : resdata._id,
                        role:     "User"   ,
                        token:jwt.sign(
                            {
                                email:resdata.email,
                                userid:resdata._id,
                                date: new Date()
                            },
                            'secret',
                            {
                                expiresIn: "60d"
                            }
                        )
                    }
                    console.log(createtoken)
                    var online = await User.changeStatusUser(resdata._id,'Online');
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



// for sending the OTP working now
router.post('/forgotpassword', async (req, res) => {
    try{
        var data = req.body;
        var userc = await User.findOne({email: data.email});
        if(userc){
            var exptime = new Date();
            exptime.setHours(exptime.getHours() + 1);
            var OTP = otpVerification.generateOTP(); 
            otpVerification.sendOtpSMS(userc.mobileNumber,userc.countryCode,OTP);
            data.OTP = OTP;
            var uOTP = await User.resetpassOTP(data); 
            res.json({message: "Please check your registerd mobile for OTP", data:{} , error:{}}); 
        }else{
            return res.status(401).json({"message":" Mobile Number not found","data":{},error:err});
        }
    }
    catch(err){ 
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});

//password reset after forgot password
router.post('/resetpassword', async (req, res) => {
    try{
        var data = req.body;
        if(!data.password || !data.confirmPassword){
            return res.status(400).json({"message":"Password and Confirm Password required","data":{},error:{}});
        }

        if(data.password != data.confirmPassword){
        return res.status(400).json({"message":"Password and Confirm Password required","data":{},error:{}});
        }
        data.password = require('crypto').createHash('sha256').update(data.password).digest('hex');
        var userc = await User.resetPasswrod(data);
        if(userc != null){
            var createtoken={
                userid : userc._id,
                role:    'User'  ,
                token:jwt.sign(
                    {
                        email:userc.email,
                        userid:userc._id,
                        date: new Date()
                    },
                    'secret',
                    {
                        expiresIn: "60d"
                    }
                )
            }
            var online = await User.changeStatusUser(resdata._id,'Online');
            Token.createToken(createtoken,(err,data)=>{})
            return res.json({"message":"Password Changed","data":{tokenData:createtoken, userDate:userc },error:{}});
        }else{
            // increase counter for preventing brute force
            User.counterResetpass(data.email,(err,cbdata)=>{})
         return res.status(400).json({"message":"Invalid OTP for the user email","data":{},error:err});
        } 
    }
    catch(err){
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});



//upload user profile to aws s3
var profileImageUpload = upload.single('profileImage');

router.post('/upload', async(req, res) => {
    try{
        var fname = 2
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }

        profileImageUpload(req, res, function(err, some)  { 
            console.log (err);
        var file = req.file;

            if(!file){ 
                return res.status(400).json({"message":"Please Upload Image","data":{},error:{}});
            }

            if (err) {
            return res.status(422).send({"message":"Image upload error","data":{},error:err.message});
            }

            var imageUrl = req.file.location;
            var data = {
                profileImage: imageUrl,
                userid :    verifydata.userid
            }
            User.updateProfileImage(data, (err, resdata) => {
                if(err){
                    return res.status(400).json({"message":"Not able to upload changes in DB","data":{},error:err});
                } else{
                    return res.json({"message":"Image Uploaded","data":resdata,error:err});
                }
            });      
        });
    }
    catch(err){
        return res.status(500).json({"message":"Internal server error","data":{},error:err});
    }
});

//user setting  discarded can remove it later 
router.get('/setting', async (req, res) => {
    try {
        var data = req.headers;
        var mobileNumber = data.mobilenumber;
        var verifyData = { 
            token: data.token,
            mobileNumber:mobileNumber
        }
        var verifyUser = await User.verifyUser(verifyData);

        if(verifyUser == null || verifyUser.length == 0){
            return res.status(400).json({"status":"failure","message":"Invalid token or mobile number user doesn't exist!","data":{}});
        }

        return res.json({"status":"success","message":"User Setting Data!","data":verifyUser});
    }
    catch(err){
        return res.status(400).json({"status":"failure","message":"Internal server Error!","data":{}})
    }
});

//user logout

router.get('/logout', async (req, res) => {
    try{
        var fname = 2
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var Offline = await User.changeStatusUser(resdata._id,'Offline');
        var mytoken =  await Token.logout(verifydata);
        return res.json({"message":"User Logged out","data":{},error:{}});
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

//update profile
router.post('/updateprofile', async(req, res) => {
    try{
        var data = req.body;
        var fname = 4
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        //console.log(data);
        var updateProfile = await User.updateUser(verifydata.userid,data);

        return res.json({"message":"Profile updated successfully!","data":updateProfile,error:{}});
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error",data:{},error:err});
    }
});






//change password after login in fromsettings 
router.post('/changepassword', async(req, res) => {

    try{
        var data = req.body;
        var fname = 5
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        if(!data.password || !data.confirmPassword){
            return res.status(400).json({message: "Password and confirm password required" ,data: {}, error:{}});
        }

        if(data.password != data.confirmPassword){
        return res.status(400).json({message: "password and contirm password does not match" ,data: {}, error:{}});
        }
        data.password = require('crypto').createHash('sha256').update(data.password).digest('hex');
        var upass = await User.updatePassword(verifydata.userid,data); 

        return res.json({message: "password Changed" ,data: upass, error:{}});

    }catch(err){
        return res.status(500).json({message:"Internal Server Error",data:{},error:err});
    }

});


router.post('/addfamilymember', async(req, res) => {
    try{
        var data = req.body;
        var fname = 6
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        //console.log(data);
        var refdata={
            userid: verifydata.userid,
            ref:    data.familyMember
        }
       User.AddFamilyMemberRef(refdata,(err,resdata)=>{
           if (err){
            return res.status(400).json({message: "Something went Wrong" ,data: {}, error:err})
           }
           else{
            return res.json({message: "Added" ,data: resdata, error:{}})
           }
       });
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error",data:{},error:err});
    }
});


router.get('/getallfamilymembers', async(req, res) => {
    try{
        var fname = 7
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var refdata={
            userid: verifydata.userid,
        }
        console.log(refdata)
       User.getfamilymemberspopulated(refdata,(err,resdata)=>{
           if (err){
            return res.status(400).json({message: "Something went Wrong" ,data: {}, error:err})
           }
           else{
            return res.json({message: "all family members" ,data: resdata, error:{}})
           }
       });
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error",data:{},error:err});
    }
});


router.get('/getalladdresses', async(req, res) => {
    try{
        var fname = 8
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var refdata={
            userid: verifydata.userid,
        }
       User.getaddresspopulated(refdata,(err,resdata)=>{
           if (err){
            return res.status(400).json({message: "Something went Wrong" ,data: {}, error:err})
           }
           else{
            return res.json({message: "all family members" ,data: resdata, error:{}})
           }
       });
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error",data:{},error:err});
    }
});


// for super admin

router.post('/changerole', async (req, res) => {
    try{
        var data = req.body;
        var fname = 9
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var changerole= await User.changeRole(data._id,data.role);
        if(changerole== null){
            return res.status(403).json({message: "User Not found!" ,data: {}, error:{}})
        }else{
            return res.json({message: "Role changed!" ,data: {}, error:{}})
        }
    }
    catch(err){ 
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});

router.post('/changestatus', async (req, res) => {
    try{
        var data = req.body;
        var fname = 10
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var changerole= await User.changeStatus(data._id,data.accountStatus);
        if(changerole== null){
            return res.status(403).json({message: "User Not found!" ,data: {}, error:{}})
        }else{
            return res.json({message: "Status changed!" ,data: {}, error:{}})
        }
    }
    catch(err){ 
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});


router.post('/remove', async (req, res) => {
    try{
        var data = req.body;
        var fname = 10
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var remove= await User.removeUser(data._id);
        if(remove== null){
            return res.status(403).json({message: "User Not found!" ,data: {}, error:{}})
        }else{
            return res.json({message: "Status changed!" ,data: {}, error:{}})
        }
    }
    catch(err){ 
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});

                   
module.exports = router;
