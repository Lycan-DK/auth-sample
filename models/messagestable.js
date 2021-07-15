var mongoose = require('mongoose');
var conn     = mongoose.createConnection('mongodb://localhost/messagesDB');
var messagesSchema = mongoose.Schema({











    
    sender: {type: String,required: true},
      time:  {type: Date},
      message:    {type: String,default : null},
      actions:    {type: String,default : null},  
},
{
    versionKey: false // You should be aware of the outcome after set to false
});




const Messages = module.exports = conn.model('messageslog', messagesSchema);
// create message log
module.exports.createMessageLog = function(data,callback) {
    var query={userid: data.userid};
    var update={
        message:     data.message,
        sender:      data.sender,
        actions:    data.actions,
        time:  new Date()
    }
	Messages.findOneAndUpdate(query, update, {upsert: true, "new": true }, callback);;
}
