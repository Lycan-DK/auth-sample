function hash(data){
    // var pl= data.password.length
    // if(pl%2==0){
    // }
    // else{
    //     if(pl%3==0){

    //     }else{

    //     }
    // }
    // var mykey = ["a","1","z","2","l","p","n","m","9"];
    var mykey = 'asgdajksbcyuee'
    var password = require('crypto').createHash('sha256').update(mykey + data.password + data._id).digest('hex');
    return password ;
}

module.exports={hash}