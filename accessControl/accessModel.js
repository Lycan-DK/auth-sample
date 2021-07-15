var mongoose = require('mongoose');
var conn     = mongoose.createConnection('mongodb://localhost/tokendb');
var tokenSchema = mongoose.Schema({
    userid:     {type: String,unique: true,require:true},
    token:      {type: String,default: null},
    role:       {type: String,default:null},
    createdAt:  {type: Date}
},
{
    versionKey: false // You should be aware of the outcome after set to false
});

const Token = module.exports = conn.model('tokenzap', tokenSchema);

module.exports.userAuthdata = (data) => {
    return Token.findOne({userid: data.userid,token: data.token});
}