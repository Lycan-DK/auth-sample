var mongoose = require('mongoose');
var conn     = mongoose.createConnection('mongodb://localhost/tokendb');
var groupsSchema = mongoose.Schema({                
    name:       {type: String,unique: true,required: true},
    requests:   [{type: mongoose.Schema.Types.ObjectId, ref: 'functionlist'}],
    createdAt:  {type:Date},
    createdBy:  {type:String},
    editedBy:   {type:String,default: null},
    editedAt:   {type:Date,default: null}
},
{
    versionKey: true // You should be aware of the outcome after set to false
});
  
const Groups =module.exports = conn.model('Groups', groupsSchema,"Groups");
// get list of Groups in DB
module.exports.getGroups = (callback) => {
    Groups.find(callback).limit();
}
 
 
//get user by Group by name
module.exports.getGName = (group) => {
    return Groups.find({name : group});
}
// for validation purpose
module.exports.getAccess = (role,fname) => {
        var query = {_id:role};
        var ref = data.ref;
        return Groups.find(query).
          populate({
            path: 'requests',
            match: { fname: fname},
            select: '_id',
          }).exec();     
}
 
// Add group
module.exports.addGroup = (data,callback) => {
    var query={name: data.name+":"+data.userid}
    var group = {
        name:       data.name+":"+data.userid,
        createdAt:  new Date(),
        createdBy:  data.userid,
    }
    console.log(group);
     Groups.findOneAndUpdate(query,group,{upsert: true,new: true},callback);
}
 
// Update Group
module.exports.updateGroup = (group, options, callback) => {
    var query = {name: group.name};
    var update = {
         requests: group.requests,                      
    }
    Groups.findOneAndUpdate(query, update, options, callback);
}
// delete Group
module.exports.deleteGroup = (id,callback)=>{
    var query ={_id: id};
    Groups.remove(query,callback);
}


// module.exports.addPermission = (data,callback)=>{
//     var query ={name: data.role};
//     Groups.findOneAndUpdate(query,{ $addToSet: {requests: {fname:data.fname, name: data.name} } })
// }



module.exports.checkPermission = (data) => {
    var query = {_id:data.role};
    var ref = data.ref;
    return Groups.find(query).
      populate({
        path: 'requests',
        match: { _id: ref},
        select: '_id',
      }).exec();     
}

module.exports.addPermissionAgency = (data) => {
    // checking if the user have permisssion
    var split = data.role.split(':');
    var split2 = data.roleid.split(':');
    if(split.length==2){
        if(split2[1]!= split[1]){
            return null
        }
    }else{
       if( data._id != split2[1]){
           return null
       }
    }
    var query = {_id:data.roleid};
    var ref = data.ref;
   return Groups.findOneAndUpdate(query, {$addToSet: {requests:ref
    }});      
}

module.exports.addPermission = (data) => {
    // checking if the user have permisssion
    // var split = data.role.split(':');
    // var split2 = data.roleid.split(':');
    // if(split.length==2){
    //     if(split2[1]!= split[1]){
    //         return null
    //     }
    // }else{
    //    if( data._id != split2[1]){
    //        return null
    //    }
    // }
    var query = {_id:data.roleid};
    var ref = data.ref;
   return Groups.findOneAndUpdate(query, {$addToSet: {requests:ref
    }});      
}


module.exports.removePermission = (data, callback) => {
    var query = {_id:data.roleid};
    var ref = data.ref;
    Groups.findOneAndUpdate(query, {$pull: {requests:ref
    }}, callback);      
}


module.exports.removePermissionAgency = (data, callback) => {
 // checking if the user have permisssion
 // role of the user and roleid for which he want to implememt changes 
    var split = data.role.split(':');
    var split2 = data.roleid.split(':');
    if(split.length==2){
        if(split2[1]!= split[1]){
            return null
        }
    }else{
       if( data._id != split2[1]){
           return null
       }
    }

    var query = {_id:data.roleid};
    var ref = data.ref;
    Groups.findOneAndUpdate(query, {$pull: {requests:ref
    }}, callback);      
}

module.exports.deleteGroupAgency = (id,callback)=>{
    var split = data.role.split(':');
    var split2 = data.roleid.split(':');
    if(split.length==2){
        if(split2[1]!= split[1]){
            return null
        }
    }else{
       if( data._id != split2[1]){
           return null
       }
    }
    var query ={_id: id};
    Groups.remove(query,callback);
}

// for refrence to pull  this is all for refrence if facing some performance issue can remove populate query and directly use object instead of ref
// Groups.findOneAndUpdate({"item":"journal"},{$pull:{"instock":{ "warehouse":"C"}}})

// for find
//db.survey.find({ results: { $elemMatch: { product: "xyz" } } })

// for push
//Groups.findOneAndUpdate({ _id: 1 },{ $addToSet: {letters: [ "c", "d" ] } })

// for query
// Story.
//   find(...).
//   populate({
//     path: 'fans',
//     match: { age: { $gte: 21 }},
//     // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
//     select: 'name -_id',
//     options: { limit: 5 }
//   }).exec();