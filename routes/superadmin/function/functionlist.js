var express = require('express');
var router = express.Router();
var FunctionList = require('../../../models/function_table');
var Token = require('../../../models/token');
// nodemailerfn(data.OTP,verifyemail.email,"OTP For Forget password")
// var passwordValidator = require('password-validator');
var Auth = require('../../../accessControl/accessControl');

router.get('/all', async (req, res) => {
    try{
        var fname = 15;
        var verifydata = await Auth.userAuth(req.headers,fname);
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        FunctionList.getAll((err,resdata)=>{
            if (err||resdata.length== 0){
                return res.status(400).json({message: "Nothing in the list" ,data: {}, error:err})
               }
               else{
                return res.json({message: "List" ,data: resdata, error:{}})
               }
        })
    }
    catch(err){
        return res.status(500).json({"message":" Internal server Error","data":{},error:err});
    }
});

router.post('/add', async (req, res) => {
    try{
        var fname = 16;
        var verifydata = await Auth.userAuth(req.headers,fname);
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data = req.body;
        data.userid = verifydata.userid
        FunctionList.addFunction(data,(err,resdata)=>{
            if (err||data.length== 0){
                return res.status(400).json({message: "Nothing in the list" ,data: {}, error:err})
               }
               else{
                return res.json({message: "List" ,data: resdata, error:{}})
               }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});


module.exports = router;
