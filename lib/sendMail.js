const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: 'AKIAJIHCJTWOIR3EQZTA',
    secretAccessKey: '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',
    region: 'us-east-1'
  });





module.exports ={
  mailSend : (email,body,title,cb) =>{
    const ses = new AWS.SES({
      "Version":"2012-10-17",
      "Statement":[
        {
          "Effect":"Allow",
          "Action":[
            "ses:SendEmail",
            "ses:SendRawEmail"
          ],
          "Resource":"*"
        }
      ]
    });
    const params = {
      Destination: {
        ToAddresses: [email] // Email address/addresses that you want to send your email
      },
      // ConfigurationSetName: 'WWW',
      Message: {
        Body: {
          Html: {
            // HTML Format of the email
            Charset: "UTF-8",
            Data: body,
            //  "<html><body><h1>Hello  Charith</h1><p style='color:red'>Sample description</p> <p>Time 1517831318946</p></body></html>"
          },
          // Text: {
          //   Charset: "UTF-8",
          //   Data: "Hello Charith Sample description time 1517831318946"
          // }
        },
        Subject: {
          Charset: "UTF-8",
          Data: title
        }
      },
      Source: "gurpreet@touchbytes.com"
    };
    const sendEmail = ses.sendEmail(params).promise();

    sendEmail
      .then(data => {
        return cb({status: 1,message:'email submitted to SES', data:data});
        console.log("email submitted to SES", data);
      })
      .catch(error => {
          return cb({status: 0, message:error});
        console.log(error);
      });


  }
}



// Given here we can see it's working fine
//    https://stackoverflow.com/questions/35946880/how-to-send-email-to-non-verified-email-address-using-aws-ses
