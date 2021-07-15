//required module
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto'), shasum = crypto.createHash('sha256');
var mongoose = require('mongoose');
var async = require("async");
var cors = require('cors');
var socketUser = require('./models/socketCustomer');
var app = express();
var admin = require('firebase-admin');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
require('dotenv').config();


//****Database connection mongodb using mongoose */

mongoose.connect('mongodb://localhost/zap911user');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function callback(){
    console.log("Database Connected");
});

/// firebase ///

// var serviceAccount = require('./google credentials');
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: serviceAccount.project_id, // I get no error here
//       clientEmail: serviceAccount.client_email, // I get no error here
//       privateKey: serviceAccount.private_key.replace(/\\n/g, '\n') // NOW THIS WORKS!!!
//   }),
//   databaseURL: serviceAccount.firebaseURL
// });
// var serviceAccount1 = require('./google credentials Driver');
// var driverFDB =admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: serviceAccount1.project_id, // I get no error here
//       clientEmail: serviceAccount1.client_email, // I get no error here
//       privateKey: serviceAccount1.private_key.replace(/\\n/g, '\n') // NOW THIS WORKS!!!
//   }),
//   databaseURL: serviceAccount1.firebaseURL
// } , "driverFDB");

// app.set('driverFDB', driverFDB);

//////////////// port define /////////////////////////////////////
app.set('port', process.env.PORT || 5000);


// importing routes files for routes /////

var user = require('./routes/user/users');
app.use('/api/v1/user', user);

var address = require('./routes/user/address');
app.use('/api/v1/address', address);

var superadmin = require('./routes/superadmin/superadmin');
app.use('/api/v1/superadmin', superadmin);

var functionlist = require('./routes/superadmin/function/functionlist');
app.use('/api/v1/fl', functionlist);

var Sgroups = require('./routes/superadmin/group/superadmingroups');
app.use('/api/v1/sg', Sgroups);

// for exnpoints not in backend

// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   console.log("2222")
//   err.status = 404;
//   next(err);
//   console.log("33333");
// });


app.options('/*', cors()) // enable pre-flight request for DELETE request
// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   console.log("========");

//   res.render('404', { url: "http://13.126.50.228:5000/" });
// });

// socket


var http = require('http').createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
var io = require('socket.io').listen(http);
app.set('socketio', io);
io.on('connection', function(socket){
 // console.log(socket.id)
  socket.on('registeruser', function(data){
    try{
    data.socketId = socket.id
    socketUser.addUser(data,(err,call)=>{console.log(call);
    // firebase test
      // var registrationToken = call.firebase_token;
      // var payload = {
      //   notification: {
      //     title: 'Welcome',
      //     body: 'Welcome to Suber!'
      //   }
      // };
      // admin.messaging().sendToDevice(registrationToken,payload)
      // .then((response) => {
      //   // Response is a message ID string.
      //   console.log('Successfully sent message:', response);
      // })
      // .catch((error) => {
      //   console.log('Error sending message:', error);
      // });
    })
    }
    catch(err){}
  })
  socket.on('disconnect', function (reason) {
    console.log(reason);
    console.log('A user disconnected ' + socket.id);
    try{
      socketUser.removeUser(socket.id,(err,call)=>{})
    }
    catch(err){}
  });

})
