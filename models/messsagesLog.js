

var mongoose = require('mongoose');
var conn     = mongoose.createConnection('mongodb://localhost/messagesDB');
var messagesLogSchema = mongoose.Schema({

    groupId:    {type: String,default : null},
    sender:     {type: String,default : null},
    receiver:    {type: String,default : null},
    messages:   [{type: mongoose.Schema.Types.ObjectId, ref: 'messages'}],
    createdAt:  {type: Date}
},
{
    versionKey: false // You should be aware of the outcome after set to false
});

const MessagesLogs = module.exports = conn.model('messageslog', messagesLogSchema);
// create message log
module.exports.createMessageLog = function(data,callback) {
    var query={userid: data.userid};
    var update={
        groupId:     data.groupId,
        sender:      data.sender,
        receiver:    data.receiver,
        createdAt:  new Date()
    }
	MessagesLogs.findOneAndUpdate(query, update, {upsert: true, "new": true }, callback);;
}


