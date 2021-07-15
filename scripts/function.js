const functionList = require('../models/function_table');
var mongoose = require('mongoose');
const async = require('async');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/tokendb', () => {
console.log('you are connected to MongoDb');
insertPM();
});
mongoose.connection.on('error', (err) => {
console.log('Mongdb connection failed due to error : ', err);
});
function insertPM() {
async.waterfall([
    function (callback) {
        functionList.create( [
    {
        name:           'Get All Users',
        fname:          1,
        createdAt:      new Date(),
        createdBy:      "default"
},
{
    name:           'Upload Profile Image',
    fname:          2,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Logout',
    fname:          3,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Update Profile User',
    fname:          4,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Change Password',
    fname:          5,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Add Family Member',
    fname:          6,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Get All Family Members',
    fname:          7,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Get All Addresses User',
    fname:          8,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Change Role Of User super admin',
    fname:          9,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Change Status Of Account Super Admin',
    fname:          10,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Get All Addresses Super Admin',
    fname:          11,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Add Address To Account User',
    fname:          12,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Remove Address User',
    fname:          13,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Edit Address User',
    fname:          14,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Get All Function List',
    fname:          15,
    createdAt:      new Date(),
    createdBy:      "default"
},{
    name:           'Add Entry To Functionlist',
    fname:          16,
    createdAt:      new Date(),
    createdBy:      "default"
},
//{
//     name:           'Logout',
//     fname:          17,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          18,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          19,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          20,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          21,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          22,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          23,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          24,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          25,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          26,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          27,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          28,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          29,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          30,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          31,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          32,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          33,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          34,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          35,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          36,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          37,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          38,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          39,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          40,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          41,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          42,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          43,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          44,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          45,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          46,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          47,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          48,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          49,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          50,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          51,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          52,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          53,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          54,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          55,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          56,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          57,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          58,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          59,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          60,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          61,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          62,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          63,
//     createdAt:      new Date(),
//     createdBy:      "default"
// },{
//     name:           'Logout',
//     fname:          64,
//     createdAt:      new Date(),
//     createdBy:      "default"
// }
] ,function(err,data){
   if(err){
       console.log("Error in inserting super admin.",err);
       process.exit();
     }
     else{
       callback(null,data)
     }
   });
 },

], function(err, data){
  console.log("successfully created superAdmin.");
  process.exit();
});
}