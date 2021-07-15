var mongoose = require('mongoose');

var userSocketSchema = mongoose.Schema({
    socketId:       {type: String},
    userid :        {type: String},
    connectedAt:    {type: Date},
    firebase_token: {type: String},
    offline:        {type: Boolean}
})


const sockerUser = module.exports =  mongoose.model('socketuser' , userSocketSchema);

module.exports.findCSocket = (data,) => {
    return	sockerUser.findOne({mobileNumber:data});
}

module.exports.addCustomerSocket = function(data, callback){
    var query= {customerId: data._id,
                mobileNumber: data.mobileNumber};
    var datad = {
        socketId:       data.socketId,
        mobileNumber:   data.mobileNumber,
        customerId :    data._id,
        connectedAt:    new Date(),
        firebase_token: data.firebase_token,
        offline:        false,
    }
    sockerUser.findOneAndUpdate(query,datad,{upsert:true, new: true },callback);
}

module.exports.removeCustomer = function(data, callback){
    var query = {socketId: data};
    var datad = {
        offline:        true
    }
    sockerUser.findOneAndUpdate(query,datad,{upsert:false, new: true },callback);
    //sockerUser.remove(query, callback)
    // addd sudo delete as firebase is integrated

}