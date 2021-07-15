const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const msmSchema = new Schema({
  title: { type: String, default: '' },
  status : {type:Number, enum:[0,1], default:1},
  body: {type:String, default:''},

}, { timestamps: true });

msmSchema.set('toObject');
msmSchema.set('toJSON');
module.exports = mongoose.model('smsTemplate', msmSchema);
