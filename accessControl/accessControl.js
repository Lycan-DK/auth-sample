var Token = require('./accessModel');
var groups = require('./groupTable')
// cust auth simple auth using data from driver and customer and sending either data or null
module.exports.userAuth = async function(data,fname){
        try{
            var myuser = await Token.userAuthdata(data,fname);
            if(myuser!=null){
                if(myuser.role==="Super_Admin_ZAP911"){ return myuser;}
                // return myuser;
                var myvar =await groups.getAccess(myuser.role,fname);
                if (myvar!=null){
                    return myuser
                }else{
                    return null
                }
            }else{
                return myuser
            }
        }catch(err){
            var myuser = null
            return myuser
        }
     }

 

    //  var usertable = require('../models/usertable.js');
    //  var grouptable = require('../accessControl/accessModel.js');
    //  module.exports = {
    //       myauthetication: async function(fname,data){
    //      var myuser = await usertable.getUserId(data.email);
    //          if(myuser.length == 0){
    //              return false;
    //          }else if(myuser[0].token === data.token && data.token != null ){
    //               var myvar =await myauth(fname,myuser[0].type)
    //              if (myvar == true){
    //                  return true;
    //              }
    //          }else{
    //              return false;
    //          }
    //       }
    //  }
    //  async function myauth(fname,type){
    //      var groups = await grouptable.getGroups();
    //      for(var i = 0;i<groups.length;i++){
    //          if(groups[i].name=== type){
    //              for (var j = 0; j<groups[i].requests.length;j++){
    //                  if(fname == groups[i].requests[j]){
    //                      return true;
    //                  }
    //              }
    //          }
    //      }
    //  }









// later  make it for admin auth
// module.exports.driverAuth =  async function(data){
//         try{
//             var myuser = await driver.drivAuth(data);
//             return myuser
//         }catch(err){
//             var myuser = null
//             return myuser
//         }
//     }

// for using it in files
/*

example headers{
    userid: asuidgiauhwdoqwdmqwd
    token: iuiag8dg9ej10290und019u20edn2o1i2h89ey91hdn913he9h239eni1ndi12
}

var verifydata = await Auth.userAuth(req.headers)
if(verifydata == null){
    return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
}


var verifydata = await Auth.driverAuth(req.headers)
if(verifydata == null){
    return res.status(401).json({message: "Not Authorized!" ,data: {}, error:{}})
}
*/
