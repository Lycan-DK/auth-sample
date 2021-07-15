var mongoose = require('mongoose');
var conn     = mongoose.createConnection('mongodb://localhost:27017/tokendb');
var functionlist = mongoose.Schema({
    fname:              {type: Number, unique: true,required: true},
    name:               {type:String,required: true , unique: true},
    createdBy:          {type: String},
    createdAt:          {type: Date},
},
{
    versionKey: false // You should be aware of the outcome after set to false
});
 


const FunctionList = module.exports = conn.model('functionlist', functionlist);


//get all functions
module.exports.getAll = function(callback, limit) {
	FunctionList.find(callback).limit(limit);
}

//add function 
module.exports.addFunction = function(data, callback){
 var address = {
    fname:              data.fname,
    name:               data.name,
    createdBy:          data.userid,
    createdAt:          new Date(),
 }
    FunctionList.create(address,callback);
}



module.exports.editAddress = (id, update, options, callback) => {
    var query = {_id: id };
    update.updatedAt = new Date(); // change it later
	return FunctionList.findOneAndUpdate(query, update, options, callback);
}

