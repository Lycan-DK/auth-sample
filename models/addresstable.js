var mongoose = require('mongoose');

var addressSchema = mongoose.Schema({
    userid:             {type: mongoose.Schema.Types.ObjectId},
    countryCode:        {type:String},
    contactNumber:      {type:String}, // its for reaching out to particular address
    city:               {type: String},
    state:              {type: String},
    country:            {type: String},
    address:            {type: String,required: true},
    createdAt:          {type: Date},
    updatedAt:          {type: Date},
    livingHere:         {type:Date, default: null},
    type:               {type: String, enum: ["Rental Living", "Office", "Living", "Others"], default:"Others"}
},
{
    versionKey: false // You should be aware of the outcome after set to false
});
 


const Address = module.exports = mongoose.model('useraddress', addressSchema);


//get all users
module.exports.getAll = function(callback, limit) {
	Address.find(callback).limit(limit);
}

//add user 
module.exports.addAddress = function(data, callback){
 var address = {
    userid:             data.userid,
    countryCode:        data.countryCode,
    contactNumber:      data.contactNumber, // its for reaching out to particular address
    city:               data.city,
    state:              data.state,
    country:            data.country,
    address:            data.address,
    createdAt:          new Date(),
    updatedAt:          new Date(),
    type:               data.type
 }
if(data.livingHere){
    address.livingHere = new Date()
}
    Address.create(address,callback);
}

//edit user profile
module.exports.getAddressByUser = (data, callback) => {
	Address.find({userid:data}, callback);
}

module.exports.getAddressById = (id, callback) => {
	Address.findById(id, callback);
}

// Updating user
module.exports.editAddress = (id, update, options, callback) => {
    var query = {_id: id , userid: data.userid};
    update.updatedAt = new Date(); // change it later
	return Address.findOneAndUpdate(query, update, options, callback);
}

module.exports.updateLivingHere = (data, callback) => {
    var query = {_id: data.id, userid: data.userid};
    update.livingHere = new Date();
	return Address.findOneAndUpdate(query, update,'userid', callback);
}

module.exports.removeAddress = (id, callback) => {
	var query = {_id: id};
	Address.remove(query, callback);
}


module.exports.getuserprofilePOPadress = (data, callback) => {
    Address
    .find({_id : data._id},'user')
     .populate({
      path:  'userid',
      select: {password:0},
    })
    .exec(callback);
}
