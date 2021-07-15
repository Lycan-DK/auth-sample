var mongoose = require('mongoose');
var conn     = mongoose.createConnection('mongodb://localhost/streamlogdb');
var streamlogSchema = mongoose.Schema({
    streamedBy:     {type: String},
    name:           {type: String},
    link:           {type: String},
    type:           {type: String},
    distressType:   {type: String},
    distressAgencyParticipants:[{type: String},],
    responders:     [{
                    userid: {type: String},
                    activated:  {type: Date},
                    location:   {type: { type: String, enum: ['Point'],default:"Point"},
                            coordinates: { type: [Number],default:[]}},
                    arrivedAt:  {type: Date},
                    }],
    adminHandlers:  [{
                    userid: {type: String},
                    startedAt:  {type: Date},
                    location:   {type: { type: String, enum: ['Point'],default:"Point"},
                                coordinates: { type: [Number],default:[]}},
                    endedAt:  {type: Date},
                    }],
    participants:   [{type:String}],
    started:        {type: Date},
    ended:          {type: Date},
    location:       {type: { type: String, enum: ['Point'], required: true,default:"Point"},
                    coordinates: { type: [Number], required: true,default:[]}},
    messageLog:     {type: mongoose.Schema.Types.ObjectId, ref: 'messageloggroups'}

},
{
    versionKey: false // You should be aware of the outcome after set to false
});
streamlogSchema.index({ "responders.location": "2dsphere" });
const StreamLog = module.exports = conn.model('streamlogs', streamlogSchema);