const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mailSchema = new Schema({
  title: { type: String, default: '' },
  status : {type:Number, enum:[0,1], default:1},
  emailTitle :{type:String,default:''},
  body: {type:String, default:''},
  adminEmailInfo:{type:String, default:''},
}, { timestamps: true });

mailSchema.set('toObject');
mailSchema.set('toJSON');
module.exports = mongoose.model('MailTemplate', mailSchema);
