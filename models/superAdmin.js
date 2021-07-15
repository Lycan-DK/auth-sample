var mongoose = require('mongoose');
var conn     = mongoose.createConnection('mongodb://localhost:27017/superadminzap911');

var superadmin = mongoose.Schema({
    name:               {type: String,required:true},
    firstName:          {type: String,default: null},
    lastName:           {type: String,default: null},
    email:              {type:String,unique: true},
    countryCode:        {type:String,required: true},
    mobileNumber:       {type:Number,unique: true},
    password:           {type:String,required:true},
    profileImage:       {type:String,default:null},
    city:               {type: String},
    state:              {type: String},
    country:            {type: String},
    groupsCreated:      [{type:String}],
    OTP:                {type:String,default:null},
    OTPexp:             {type:Number,default:0},
    resetPassOTP:       {type:String,default:null},
    resetPassOTPexp:    {type:Number,default:0},
    createdAt:          {type: Date},
    UpdatedAt:          {type: Date},
    passwordTries:      {type: Number, default: 0},
    passwordTriesDate:  {type: Date},
    role:               {type: String},
},
{
    versionKey: false // You should be aware of the outcome after set to false
});
 // hide password tries and password tries date  "Its for preventing Brute force attack on passwords"


const SuperAd = module.exports = conn.model('superadmin', superadmin);


module.exports.findByName = (name,callback) => {
    SuperAd.findOne({name : name},callback);
}