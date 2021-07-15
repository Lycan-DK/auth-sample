

var POs = require('../models/paymentoptions');
const keyPublishable = 'pk_test_QMoW1ng2EVc2DScUP6eQdeVQ';
const keySecret = 'sk_test_t30FrLyH5y55yhu0kzLDQPWk';
const stripe = require("stripe")(keySecret);


async function paymenthandler(data){
    if(data.type ==='Visa'|| data.type==='MasterCard'){ // add any card type here which is supported
        try{
            var getCard = await POs.getPObyId(data.paymentSourceRefNo);
            data.token = getCard.token;
            data.customerId = getCard.customerId; // for log purposes
            const charge = await stripe.charges.create({
                amount: 1000,
                currency: 'usd',
                customer: getCard.token
              });
            // console.log('Charge',charge);
            return charge
        }catch(err){
            console.log(err);
        }
    }

    if(data.paymentMethod ==='Cash'){
        console.log("Cash");
    }
}


async function POhandler(data){
    if(data.type !='Visa'|| data.type!='MasterCard'){ // add any card type here which is supported
        try{
            console.log(data);
            const customer = await stripe.customers.create({
                source: data.token,
                email: data.customerId
            });
            return customer
        }catch(err){
            console.log(err);
        }
    }
}

module.exports={paymenthandler,POhandler}
