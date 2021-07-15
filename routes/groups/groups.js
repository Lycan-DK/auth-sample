var Auth = require('../../accessControl/accessControl');
var Groups = require('../../models/groupstable');
var User = require('../../models/usertable.js');// for now use it later on use rabbit mq or any other message queuing for thois 


// get all adresses
router.get('/getgroups', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
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
                res.json({message: "No address added by user" ,data: resdata, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

// add address
router.post('/addgroup', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data = req.body;
        data.userid= verifydata.userid;
        Groups.addGroup(data,(err,resdata)=>{
            if(err){
                return res.status(404).json({message: "Something went wrong not able to add Group" ,data: {}, error:err})
            }else{
                var ref = {
                    userid: data.userid,
                    ref:    resdata._id
                }
                User.AddAddressRef(ref,(err,mdata)=>{})
                return res.json({message: "address added" ,data: resdata, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

// remove groups
router.delete('/removegroups', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data =  req.body;
        data.userid = verifydata.userid
        Address.removeGroup(data, (err,resdata)=>{
            if(err||resdata.n==0){
                if (err){
                    res.status(401).json({message: "You are not authorized to delete this group" ,data: {}, error:err})
                }else{
                    res.status(404).json({message: "Already deleted the group" ,data: {}, error:{}})
                }
            }else{
                res.json({message: "Deleted the group" ,data: {}, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});

// edit group 
router.post('/editgroup', async (req, res) => {
    try{
        var verifydata = await Auth.userAuth(req.headers)
        if(verifydata == null){
            return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
        }
        var data =  req.body;
        data.userid = verifydata.userid
        Groups.editGroup(data, (err,resdata)=>{
            if(err||resdata.n==0){
                if (err){
                    res.status(401).json({message: "You are not authorized to edit this group detials" ,data: {}, error:err})
                }else{
                    res.status(404).json({message: "Something went wrong" ,data: {}, error:{}})
                }
            }else{
                res.json({message: "group detials edited" ,data: {}, error:{}})
            }
        })
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error","data":{},error:err});
    }
});
module.exports= router;