
var trip = require('../../models/triptable');
var Driver= require('../../models/drivertable');
var User = require('../../models/usertable.js');
var SocketD = require('../../models/socketDriver');
var admin = require('firebase-admin');

module.exports = function(agenda) {
    // defining the archive ride for the jobs in collection
    agenda.define('archive ride', function(job, done) {
        // getting trip information
        trip.findOneAndUpdate({_id: job.attrs.data.rideId},
            { $set: { tripStatus: 'searching' }}, function (err,datad) {
            if(err|| datad == null) {
            }else{
                done();
                // completing job
////////////////////////////// need to add repetative search of driver for 15 mins ///////
                Driver.aggregate(
                    [
                        { "$geoNear": {
                            "near": datad.startLocation,
                            "distanceField": "distance",
                            key: "driverLocation",
                            "spherical": true,
                            "maxDistance": 15000,
                            num: 8,
                            query: { driverStatus: "Finding Trips" },
                        }}
                    ],
                    async function(err,results) {
                        // results of driver found
                        if (err){}
                        else { var v = 0;
                            var i = 0;
                            if (results.length == 0){
                                return res.json({"message":"No Drivers Around",data:{status: false},"error": err});
                            }else{
                                res.json({"message":"Drivers Found",data:{status: true},"error": err});
                            }
                            var func = function(i){
                                return async function(){
                                    if (results.length<=i)return;
                                    var mytrip =await trips.getTripsById(Cdata.ref)
                                    if(mytrip.tripStatus != 'searching'){
                                    }else{
                                        try{var sendto = await SocketD.findDSocketS(results[v].email)}catch(err){}
                                        
                                        // driver fdb
                                        if(sendto!=null){
                                            var driverFDB = req.app.get("driverFDB");
                                            var registrationToken = sendto.firebase_token;
                                            var payload = {
                                                notification: {
                                                    title: 'Trip Request',
                                                    body: 'Trip Request From :' + datad.customerName
                                                }
                                            };
                                            admin.messaging(driverFDB).sendToDevice(registrationToken,payload)
                                            .then((response) => {
                                            // Response is a message ID string.
                                                // console.log('Successfully sent message:', response);
                                            })
                                            .catch((error) => {
                                                // console.log('Error sending message:', error);
                                            });
                                        //test end
                                        }
                                        var io = req.app.get('socketio');
                                        var sdata = {
                                            receivedRequest: 1,
                                            email: results[v].email,
                                            driverId: results[v]._id
                                        };
                                        stats.addRequestRec(sdata);
                                        datad.distanceToPickup = Math.round(results[v].distance);
                                        if (sendto!= null|| sendto!= undefined){
                                            try{io.sockets.to(sendto.socketId).emit('find_trip', datad)}catch(err){}
                                        }v=v+1;
                                        setTimeout(func(++i), 15500); 
                                    }
                                }   
                            }
                            setTimeout(func(i), 0); 
                        }
                    }
                )
                ///////////////////////////
            }
        })

    });

};