var nodemailer = require('nodemailer');
module.exports.nodemailerfn = (mailData,sendTo,mailSubject)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'lycandking@gmail.com', /// enter smtp details here
        pass: 'lycandking11(!'
        }
    });
    var data=mailData; // any data you want to display
    var mailOptions = {
        from: 'youremail@gmail.com',
        to: sendTo,
        subject: mailSubject,
        text: 'That was easy!',
        html: '<h2> Your OTP is : <h4> '+data+' </h4> <h2>'
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return console.log(error)
            } else {
            console.log("mail successful");
            }
    });
}