var express = require('express');
const routers = express.Router();
var path = require('path');
const mongoose = require('mongoose');


// routers.use('/test',(req, res, next) => {
//     //console.log("Third Middleware");
//     res.sendFile(path.join(__dirname, '../', 'view', 'index.html'));
// })

const Schema = mongoose.Schema;
var customerSchema = new Schema({
    name:String,
    password:String,
    email:String,
    phoneNumber:String,
    dob:Date,
    status:String
});
const Customer = mongoose.model('Customer',customerSchema);
routers.post('/customer', (req,res, next)=>{
    console.log('saved',req.body);
    var doc = new Customer({
        name:req.body.fullname,
        password:req.body.c_pswd,
        email:req.body.email,
        phoneNumber:req.body.phone,
        dob:req.body.dob,
        status:"Active"
    });
    doc.save().then( x => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
});
routers.get('/customer',(req,res,next)=>{
    Customer.find({email:req.query.username,password:req.query.password},(err,resp) => {
        if(!err && resp){
            console.log(req.query);
            res.send(resp);
        }else{
            console.log(err);
        }
    })
})

routers.post('/customer/update', (req,res,next) => {
    let data = {"email": req.body.username};
    let setdata = { $set: {"password": req.body.password} }
    Customer.updateOne(data, setdata, (err, response) =>{
        if(!err && response){
            console.log('Success!!');
            res.send(response);
        }else{
            console.log(err);
        }
    })
})
module.exports = routers;