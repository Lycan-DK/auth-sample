var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name:               {type: String,required:true},
    firstName:          {type: String,default: null},
    lastName:           {type: String,default: null},
    email:              {type:String,unique: true,require:true},
    countryCode:        {type:String,required: true},
    mobileNumber:       {type:Number,unique: true,required:true},
    password:           {type:String,required:true},
    profileImage:       {type:String,default:null},
    city:               {type: String},
    state:              {type: String},
    country:            {type: String},
    groupsCreated:      [{type:String}],
    memberOfGroups:     [{type:String }],
    address:            [{type: mongoose.Schema.Types.ObjectId, ref: 'useraddress'}],
    famillyMembers:     [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    OTP:                {type:String,default:null},
    OTPexp:             {type:Number,default:0},
    resetPassOTP:       {type:String,default:null},
    resetPassOTPexp:    {type:Number,default:0},
    createdAt:          {type: Date},
    UpdatedAt:          {type: Date},
    UserStatus:         {type: String, enum: ["Online","Streaming","Receiving", "Receiving Distress Stream", "In Distress", "Offline", "On Way To Help", "On Location Of Distress", "Not Verified"], default:"Not Verified"},
    accountStatus:      {type: String, enum:["Activated", "Deactivated","Registered"]},
    passwordTries:      {type: Number, default: 0},
    passwordTriesDate:  {type: Date},
    role:               {type: String},
},
{
    versionKey: false // You should be aware of the outcome after set to false
});
 // hide password tries and password tries date  "Its for preventing Brute force attack on passwords"


const User = module.exports = mongoose.model('user', userSchema);


//get all users
module.exports.getUsers = function(callback, limit) {
	User.find(callback).limit(limit);
}
module.exports.findByEmail = function(data,callback) {
	User.findOne({email: data},callback);
}
module.exports.findByEmailAsync = function(data) {
	return User.findOne({email: data});
}


//add user 
module.exports.addUser = function(data, callback){
    if (!data.profileImage){
        data.profileImage == null
    }
    var user = { 
    name:               data.name,
    firstName:          data.firstName,
    lastName:           data.lastName,
    email:              data.email,
    countryCode:        data.countryCode,
    mobileNumber:       data.mobileNumber,
    password:           data.password,
    profileImage:       data.profileImage,
    city:               data.city,
    state:              data.state,
    country:            data.country,
    OTP:                data.OTP,
    createdAt:          new Date(),
    UpdatedAt:          new Date(),
    accountStatus:      "Registered",
    role:               "User"
    }
    User.create(user,callback);
}

//edit user profile
module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
}

// Updating user
module.exports.updateUser = (id, update) => {
    var query = {_id: id};
    update.updatedAt = new Date(); // change it later
	return User.findOneAndUpdate(query, update, options);
}

module.exports.removeUser = (id) => {
	var query = {_id: id};
	return User.remove(query);
}

module.exports.sendverifymail = (data, callback) => {
    var query = {email: data.email};
    var update ={
        OTP: data.OTP,
        OTPexp: 0
    }
    User.findOneAndUpdate(query, update, {"fields": { password:0 }, "new": true }, callback);
    // edit fileds value later on 
}

module.exports.activateUser = (data, callback) => {
    var query = {email: data.email, OTP: data.OTP, OTPexp: {$lte : 5}};
    var update ={
        accountStatus:"Activated",
        OTP: null,
        OTPexp: 0
    }
    User.findOneAndUpdate(query, update, {"fields": { password:0 }, "new": true }, callback);
    // edit fileds value later on 
}


module.exports.counterActivateUser= (data, callback) => {
    var query = {email: data.email};
    User.findOneAndUpdate(query, {$inc: {OTPexp:1}}, {"fields": { password:0 }, "new": true }, callback);
    // edit fileds value later on 
}


module.exports.resetpassOTP = (data, callback) => {
    var query = {email: data.email};
    var update ={
        resetPassOTP:data.OTP,
        resetPassOTPexp: 0,
    }
    User.findOneAndUpdate(query, update, {"fields": { password:0 }, "new": true }, callback);
    // edit fileds value later on 
}


module.exports.resetPasswrod = (data, callback) => {
    var query = {email: data.email, resetPassOTP: data.OTP, resetPassOTPexp: {$lte : 5}};
    var update ={
        password: data.password,
        resetPassOTP:null,
        resetPassOTPexp: 0,
        updatedAt: new Date()
    }
    User.findOneAndUpdate(query, update, {"fields": { password:0 }, "new": true }, callback);
    // edit fileds value later on 
}


module.exports.counterResetpass = (data, callback) => {
    var query = {email: data.email};
    User.findOneAndUpdate(query, {$inc: {resetPassOTPexp:1}}, {"fields": { password:0 }, "new": true }, callback);
    // edit fileds value later on 
}


module.exports.updateProfileImage = (data, callback) => {
    var query = {_id: data.userid};
    var update ={
        profileImage:data.profileImage,
        updatedAt: new Date()
    }
    User.findOneAndUpdate(query, update, {"fields": { password:0 }, "new": true }, callback);
    // edit fileds value later on 
}

module.exports.changePassword = (id,data) => {
    var query = {_id:id};
    var update ={
        password: data.password,
        updatedAt: new Date()
    }
  return  User.findOneAndUpdate(query, update, {"fields": { password:0 }, "new": true });
    // edit fileds value later on 
}

module.exports.changeRole = (id,data) => {
    
    var query = {_id:id};
    var update ={
        role: data,
        updatedAt: new Date()
    }
    console.log(query);
  return  User.findOneAndUpdate(query, update, {"fields": { password:0 }, "new": true });
    // edit fileds value later on 
}

module.exports.changeStatus = (id,data) => {
    
    var query = {_id:id};
    var update ={
        accountStatus: data,
        updatedAt: new Date()
    }
    console.log(query);
  return  User.findOneAndUpdate(query, update, {"fields": { password:0 }, "new": true });
    // edit fileds value later on 
}

module.exports.changeStatusUser = (id,data) => {
    
    var query = {_id:id};
    var update ={
        UserStatus: data,
    }
    console.log(query);
  return  User.findOneAndUpdate(query, update, {"fields": { password:0 }, "new": true });
    // edit fileds value later on 
}

// create address ref
module.exports.AddAddressRef = (data, callback) => {
    var query = {_id:data.userid};
    var ref = data.ref;
    User.findOneAndUpdate(query, {$push: {address:ref
    }},{ upsert: true , new : true}, callback);  
}
module.exports.AddFamilyMemberRef = (data, callback) => {
    var query = {_id:data.userid};
    var ref = data.ref;
    User.findOneAndUpdate(query, {$push: {famillyMembers:ref
    }},{ upsert: true , new : true}, callback);  
}


module.exports.AddGroupsCreatedRef = (data, callback) => {
    var query = {_id:data.userid};
    var ref = data.ref;
       User.findOneAndUpdate(query, {$push: {groupsCreated:ref
    }},{ upsert: true , new : true}, function(err,data){
        if (err){
            console.log(err)
        }
    });  
}

module.exports.AddGroupsMemberRef = (data, callback) => {
    var query = {_id:data.userid};
    var ref = data.ref;
    User.findOneAndUpdate(query, {$push: {memberOfGroups:ref
    }},{ upsert: true , new : true}, function(err,data){
        if (err){
            console.log(err)
        }
    });  
}



module.exports.getaddresspopulated = (data, callback) => {
    User
    .find({_id : data.userid},'useraddress')
     .populate({
      path:  'address'
    })
    .exec(callback);
}

module.exports.getfamilymemberspopulated = (data, callback) => {
    User
    .find({_id : data.userid},'user')
     .populate({
        path:  'famillyMembers'
    })
    .exec(callback);
}

// for refrence
// module.exports.getUserWithPOPTripsUpcoming = (data, callback) => {
//     User
//     .find({_id : data._id},'trips')
//      .populate({
//       path:  'trips',
//       select: {promoCodeCost:0,customerRefId:0,driverRefId:0,percentCharge: 0,customerId:0,driverWaitedUpto:0,promoCode:0 ,paymentSourceRefNo:0,paymentRefNo:0,paymentMethod:0,driverWaitedUpto:0, canceled:0},
//       options:{ sort:{tripConfirmedAt : -1} , limit: 20},
//       match: { tripStatus: 'schedule',scheduledAt:{$gt : new Date()}}
//     })
//     .exec(callback);
// }






/* its for clearing refrences 
productSchema.pre("remove", function(next) {
  var product = this;
  Comment.remove({ product_id: product._id }, next);
});

productSchema.post("remove", function(product) {
  Comment.remove({ product_id: product._id }).exec();
});
*/