var config = require('../config.js');
// Twilio Library
var Twilio = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_ACCOUNT_AUTH_TOKEN);

console.log(Twilio);
module.exports.generateOTP = function() {
    var codelength = 4;
    return Math.floor(Math.random() * (Math.pow(10, (codelength - 1)) * 9)) + Math.pow(10, (codelength - 1));
}

module.exports.checkTwilioConfig = function() {

    if(config.TWILIO_API_KEY == null || config.TWILIO_API_SECRET || config.TWILIO_ACCOUNT_SID){
          console.log("Please set twilio api key in config file!");
          return false;
    }

    return true;

}

module.exports.sendOtpSMS = function(mobileNumber,countryCode,message) {
    Twilio.messages.create({
        from: config.TWILIO_PHONE_NUMBER,
        to: '+'+countryCode+mobileNumber,
        body: message ,
      }).then((message) => console.log(message.sid)).catch(error=>{
          console.log(error);
      });
}

module.exports.sendpanicSMS = function(mobileNumber,countryCode,message) {
    Twilio.messages.create({
        from: config.TWILIO_PHONE_NUMBER,
        to: '+'+countryCode+mobileNumber,
        body: message ,
      }).then((message) => console.log(message.sid)).catch(error=>{
          console.log(error);
      });
}
