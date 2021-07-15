var mongoose = require('mongoose');
var conn     = mongoose.createConnection('mongodb://localhost/groupsdb');
var groupSchema = mongoose.Schema({
    name:               {type: String},
    createdBy:          {type: String},
    groupType:          {type: String},
    groupBaseLocation:  {type: { type: String, enum: ['Point'], required: true,default:"Point"},
                        coordinates: { type: [Number], required: true,default:[]}},
    contactNumber:      {type: String},
    SuperAdmin:         {type: String},
    pastStreamLinks:    [{type: String}],
    pastHandledStreams: [{type: String}],
    members:            [{
                        userid:     {type:String},
                        addedOn:    {type:Date},
                        role:       {type:String},  
                        }],
    createdAt:          {type:Date},
    messageLog:         {type: String}
},
{
    versionKey: false // You should be aware of the outcome after set to false
});
groupSchema.index({ groupBaseLocation: "2dsphere" });
const Groups = module.exports = conn.model('groups', groupSchema);

module.exports.getGroups = function(callback, limit) {
	Groups.find(callback).limit(limit);
}



module.exports.getGroupsByGroupType = function(data,callback) {
	Groups.find({groupType: data.groupType},callback);
}

module.exports.getGroupsByLocation = function(data,callback) {
	Groups.find({groupBaseLocation: data.groupBaseLocation},callback);
}




module.exports.getGroupsByUser = function(data,callback) {
	Groups.find({creatorId: data.userid},callback);
}

module.exports.addGroups = function(data, callback){
    var group = {
        name:               {type: String},
        createdBy:          {type: String},
        groupType:          {tyep: String},
        groupBaseLocation:  {type: { type: String, enum: ['Point'], required: true,default:"Point"},
                            coordinates: { type: [Number], required: true,default:[]}},
        contactNumber:      {type: String},
        SuperAdmin:         {type: String},
        createdAt:          new Date(),
    }
   Groups.create(group,callback);
   }