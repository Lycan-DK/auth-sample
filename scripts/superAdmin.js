const SuperAdmin = require('../models/superAdmin');
var mongoose = require('mongoose');
const async = require('async');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/superadminzap911', () => {
console.log('you are connected to MongoDb');
insertPM();
});
mongoose.connection.on('error', (err) => {
console.log('Mongdb connection failed due to error : ', err);
});
function insertPM() {
async.waterfall([
    function (callback) {
      SuperAdmin.create( [
    {
      name:               "Super",
      firstName:          'Super',
      lastName:           'Admin',
      countryCode:        "+91",
      password:           require('crypto').createHash('sha256').update("denied").digest('hex'),
      city:               null,
      state:              null,
      country:            null,
      createdAt:          new Date(),
      UpdatedAt:          new Date(),
      role:               "Super_Admin_ZAP911"
}] ,function(err,data){
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