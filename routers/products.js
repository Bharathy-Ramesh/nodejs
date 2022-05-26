var express = require('express');
const routers = express.Router();
var path = require('path');
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var productSchema = new Schema({
    title:String,
    price:String,
    description:String,
    category:String,
    image:String,
    rating:Number,
    count:Number,
    quantity:Number
});
const Products = mongoose.model('Products',productSchema);
routers.post('/products', (req,res, next)=>{
    console.log('saved',req.body);
    var doc = new Products({
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        category:req.body.category,
        image:req.body.image,
        rating:req.body.rating,
        count:req.body.count,
        quantity:req.body.count
    });
    doc.save().then( x => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
});

routers.get('/products',(req,res,next)=>{
    Products.find((err,resp) => {
        if(!err && resp){
            console.log(resp);
            res.send(resp);
        }else{
            console.log(err);
        }
    })
})

routers.get('/product',(req,res,next)=>{
    var ids = new ObjectId(req.query.id);
    Products.find({_id:ids},(err,resp) => {
        if(!err && resp){
            console.log(resp);
            res.send(resp);
        }else{
            console.log(err);
        }
    })
});

routers.post('/product/update', (req,res,next) => {
    console.log("body",req.body);
    let data = {"_id": req.body._id};
    let setdata = { $set: {"count": req.body.count} }
    Products.updateOne(data, setdata, (err, response) =>{
        if(!err && response){
            console.log('Success!!', response);
            res.send(response);
        }else{
            console.log(err);
        }
    })
})

var orderSchema = new Schema({
    custId : String,
    productId : String,
    quantity:Number
});
const Orders = mongoose.model('Orders',orderSchema);
routers.post('/order', (req,res, next)=>{
    console.log('saved',req.body);
    var doc = new Orders({
        custId:req.body.custId,
        productId:req.body.productId,
        quantity:req.body.quantity
    });
    doc.save().then( x => {
        res.sendStatus(200);
        console.log('z',x);
    }).catch(err => {
        res.sendStatus(500);
    })
});

module.exports = routers;