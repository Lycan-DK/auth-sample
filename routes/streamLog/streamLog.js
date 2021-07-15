var Auth = require('../../accessControl/accessControl');
var StreamLog = require('../../models/streamlogtable');
var User = require('../../models/usertable.js');
var express = require('express');
var router = express.Router();

// get all adresses
/*
get past stream
get handled stream
accessible to people

*/
router.get('/getadresses', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        StreamLog.getAddressByUser(verifydata.userid,(err,resdata)=>{
            if(err|| resdata==null){
                if (err){
                    res.status(404).json({message: "Something went wrong" ,data: {}, error:err})
                }else{
                    res.json({message: "No Stream Log by user" ,data: {}, error:{}})
                }
            }else{
                res.json({message: "Stream Log address" ,data: resdata, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

// add streamLog
router.post('/addstreamlog', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data = req.body;
        data.userid= verifydata.userid;
        StreamLog.addAddress(data,(err,resdata)=>{
            if(err){
                return res.status(404).json({message: "Something went wrong not able to add stream log" ,data: {}, error:err})
            }else{
                var ref = {
                    userid: data.userid,
                    ref:    resdata._id
                }
                User.AddAddressRef(ref,(err,mdata)=>{
                    
                })
                return res.json({message: "Stream Log added" ,data: resdata, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

// remove stream log
router.delete('/removestreamlog', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data =  req.body;
        data.userid = verifydata.userid
        StreamLog.removeStreamLog(data, (err,resdata)=>{
            if(err||resdata.n==0){
                if (err){
                    res.status(401).json({message: "You are not authorized to delete this stream" ,data: {}, error:err})
                }else{
                    res.status(404).json({message: "Already deleted the Stream" ,data: {}, error:{}})
                }
            }else{
                res.json({message: "Deleted the Stream Log" ,data: {}, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

// edit stream Log 
router.delete('/editstreamlog', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data =  req.body;
        data.userid = verifydata.userid
        StreamLog.editAddress(data._id,data, (err,resdata)=>{
            if(err||resdata.n==0){
                if (err){
                    res.status(401).json({message: "You are not authorized to edit this stream log detials" ,data: {}, error:err})
                }else{
                    res.status(404).json({message: "Something went wrong" ,data: {}, error:{}})
                }
            }else{
                res.json({message: "stream log detials edited" ,data: {}, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

module.exports = router;