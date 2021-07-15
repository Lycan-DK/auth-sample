var Auth = require('../../accessControl/accessControl');
var Address = require('../../models/addresstable');
var User = require('../../models/usertable.js');
var express = require('express');
var router = express.Router();

// get all adresses
router.get('/getadresses', async (req, res) => {
    try{
        var fname = 11
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        Address.getAddressByUser(verifydata.userid,(err,resdata)=>{
            if(err|| resdata==null){
                if (err){
                    res.status(404).json({message: "Something went wrong" ,data: {}, error:err})
                }else{
                    res.json({message: "No address added by user" ,data: {}, error:{}})
                }
            }else{
                res.json({message: "added  address by user" ,data: resdata, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

// add address
router.post('/addadresses', async (req, res) => {
    try{
        var fname = 12
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data = req.body;
        data.userid= verifydata.userid;
        Address.addAddress(data,(err,resdata)=>{
            if(err){
                return res.status(404).json({message: "Something went wrong not able to add address" ,data: {}, error:err})
            }else{
                var ref = {
                    userid: data.userid,
                    ref:    resdata._id
                }
                User.AddAddressRef(ref,(err,mdata)=>{

                })
                return res.json({message: "address added" ,data: resdata, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

// remove address
router.delete('/removeaddress', async (req, res) => {
    try{
        var fname = 13
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data =  req.body;
        data.userid = verifydata.userid
        Address.removeAddress(data, (err,resdata)=>{
            if(err||resdata.n==0){
                if (err){
                    res.status(401).json({message: "You are not authorized to delete this addess" ,data: {}, error:err})
                }else{
                    res.status(404).json({message: "Already deleted the address" ,data: {}, error:{}})
                }
            }else{
                res.json({message: "Deleted the address" ,data: {}, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

// edit address 
router.delete('/editaddress', async (req, res) => {
    try{
        var fname = 14
        var verifydata = await Auth.userAuth(req.headers,fname)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data =  req.body;
        data.userid = verifydata.userid
        Address.editAddress(data._id,data, (err,resdata)=>{
            if(err||resdata.n==0){
                if (err){
                    res.status(401).json({message: "You are not authorized to edit this addess detials" ,data: {}, error:err})
                }else{
                    res.status(404).json({message: "Something went wrong" ,data: {}, error:{}})
                }
            }else{
                res.json({message: "address detials edited" ,data: {}, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

module.exports = router;