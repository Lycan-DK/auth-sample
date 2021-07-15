var express = require('express');
var router = express.Router();
var Sgroup = require('../../../accessControl/groupTable');
var Token = require('../../../models/token');
// nodemailerfn(data.OTP,verifyemail.email,"OTP For Forget password")
// var passwordValidator = require('password-validator');
var Auth = require('../../../accessControl/accessControl');


router.post('/add', async (req, res) => {
    try{
        var fname = 16;
        var verifydata = await Auth.userAuth(req.headers,fname);
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data = req.body;
        data.userid = verifydata.userid
        Sgroup.addGroup(data,(err,resdata)=>{
            console.log(resdata)
            if (err||resdata== null){
                return res.status(400).json({message: "Nothing in the list" ,data: {}, error:err})
               }
               else{
                return res.json({message: "Group added" ,data: resdata, error:{}})
               }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});


router.get('/', async (req, res) => {
    try{
        var fname = 16;
        var verifydata = await Auth.userAuth(req.headers,fname);
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data = req.body;
        data.userid = verifydata.userid
        Sgroup.getGroups((err,resdata)=>{
            if (err||resdata.length== 0){
                return res.status(400).json({message: "Nothing in the list" ,data: {}, error:err})
               }
               else{
                return res.json({message: "Group List" ,data: resdata, error:{}})
               }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});


router.post('/access', async (req, res) => {
    try{
        var fname = 16;
        var verifydata = await Auth.userAuth(req.headers,fname);
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data = req.body;
        data.userid = verifydata.userid
        var accessgroup =await Sgroup.addPermission(data)
        if (accessgroup== null){
            return res.status(400).json({message: "not able to edit in the list" ,data: {}, error:{}})
            }
        else{
            return res.json({message: "added access to group" ,data: accessgroup, error:{}})
        }
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

module.exports = router;