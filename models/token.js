var mongoose = require('mongoose');
var conn     = mongoose.createConnection('mongodb://localhost/tokendb');
var toeknSchema = mongoose.Schema({
    userid:     {type: String,unique: true,require:true},
    token:      {type: String,default: null},
    role:       {type: String}, // its for types like user admin super admins etc later can be used to restrict access
    createdAt:  {type: Date}
},
{
    versionKey: false // You should be aware of the outcome after set to false
});
const Token = module.exports = conn.model('tokenzap', toeknSchema);
// create token
module.exports.createToken = function(data,callback) {
    var query={userid: data.userid};
    var update={
        userid:     data.userid,
        token:      data.token,
        role:       data.role,
        createdAt:  new Date()
    }
	Token.findOneAndUpdate(query, update, {upsert: true, "new": true }, callback);
}

module.exports.logout = function(data) {
    var query={userid: data.userid};
	return Token.remove(query);
}