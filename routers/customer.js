var express = require('express');
const routers = express.Router();
var path = require('path');
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
var fs = require('fs');
var path = require('path');
const { query } = require('express');
const uuid = require('uuid');
const uuidv = uuid.v1();


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
        let credentials = req.query; 
        const token = jwt.sign({credentials}, 'my_secret_key')
        if(!err && resp){
            //let cust = {token:token};
            //console.log(resp);
            res.send({auth:true, token:token, detail:resp[0]});
        }else{
            console.log(err);
        }
    })
})

function ensureToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else{
        res.sendStatus(403);
    }
}

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

//products

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
routers.post('/products', ensureToken, (req,res, next) => {
    jwt.verify(req.token,'my_secret_key', (err, data) => {
        if(err){
            res.sendStatus(403);
        } else {
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
        }
        })
});

routers.get('/products', ensureToken, (req,res,next)=>{
    //console.log('req', req);
    jwt.verify(req.token,'my_secret_key', (error, data) => {
        if(error){
            res.sendStatus(403)
        } else {
            Products.find((err,resp) => {
                if(!err && resp){
                    //console.log(resp);
                    res.send(resp);
                }else{
                    console.log(err);
                }
            })
        }    
   })
})

routers.get('/product', ensureToken, (req,res,next)=>{
    jwt.verify(req.token,'my_secret_key', (error, data) => {
        if(error){
            console.log('yu',error);
            res.sendStatus(403);
        } else{
            var ids = new ObjectId(req.query.id);
            Products.find({_id:ids},(err,resp) => {
                if(!err && resp){
                    //console.log(resp);
                    res.send(resp);
                }else{
                    console.log(err);
                }
            })
        }
    })
});

routers.post('/product/update', ensureToken, (req,res,next) => {
    jwt.verify(req.token,'my_secret_key', (error, data) => {
        if(error){
            res.sendStatus(403);
        } else{
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
        }
    })
})

var orderSchema = new Schema({
    custId : String,
    productId : String,
    quantity:Number
});
const Orders = mongoose.model('Orders',orderSchema);
routers.post('/order', ensureToken, (req,res, next)=>{
    jwt.verify(req.token,'my_secret_key', (error, data) => {
        if(error){
            res.sendStatus(403);
        } else{
            console.log('saved',req.body);
            var doc = new Orders({
                custId:req.body.custId,
                productId:req.body.productId,
                quantity:req.body.quantity
            });
            // doc.save().then( x => {
            //     res.sendStatus(200);
            //     console.log('z',x);
            // }).catch(err => {
            //     res.sendStatus(500);
            // })
            
            const query = { productId: req.body.productId };
            const update = { $set: {
                custId:req.body.custId,
                productId:req.body.productId,
                quantity:req.body.quantity
            }};
            const options = { upsert: true };
            Orders.updateOne(query, update, options).then( x => {
                    res.sendStatus(200);
                    console.log('z',x);
                }).catch(err => {
                    res.sendStatus(500);
                });
        }
    });
    
});



routers.get('/order', ensureToken, (req,res,next)=>{
    jwt.verify(req.token,'my_secret_key', (error, data) => {
        if(error){
            console.log('yu',error);
            res.sendStatus(403);
        } else{
            Orders.find({custId:req.query.custId},(err,resp) => {
                if(!err && resp){
                    //console.log(resp);
                    res.send(resp);
                }else{
                    console.log(err);
                }
            })
        }
    })
});

routers.delete('/order',(req,res) =>{
            Orders.deleteOne({productId:req.query.prodId,custId:req.query.custId}, (err,resp) => {
                if(!err && resp){
                    res.send(resp);
                }else{
                    console.log(err);
                }
            })
})

//ReactJS

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        debugger;
        console.log('file', req.body);
        cb(null, 'uploads/images')
    },
    filename: (req, file, cb) => {
        console.log('file', file);
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuid() + '.' + ext);
    }
});
  
const upload = multer({
    limits:500000,
    storage: storage
 });

//const upload = multer({'dest':'uploads/'}).single('image')

var imgSchema = new Schema({
    name:String,
    custId:String,
    image:{
        data:Buffer,
        contentType:String
    }
})

const imgDetail = mongoose.model('imgDetail',imgSchema);

routers.post('/upload',upload.single('image'), (req,res) => {
    console.log('upload',upload)
        let docs = new imgDetail({
            name:req.body.name,
            custId:req.body.custId,
            image:{
                data:req.file,
                contentType:'image/jpg'
            }
        })
        //console.log('doc', docs);
        docs.save().then( x => {
            res.sendStatus(200);
            console.log('success upload');
        }).catch(err => {
            res.sendStatus(500);
        })
    })    

routers.get('/upload',(req,res,next)=>{
    imgDetail.find({email:req.query.userId},(err,resp) => {
        if(!err && resp){
            console.log(resp);
            res.send(resp[0]);
        }else{
            console.log(err);
        }
    })
})

//user

var userSchema = new Schema({
    name:String,
    password:String,
    email:String,
    phoneNumber:String,
    status:String,
});
const userDetail = mongoose.model('userDetail',userSchema);

routers.post('/user', (req,res)=>{
    console.log('user', req.body);
    let doc = new userDetail({
        name:req.body.username,
        password:req.body.password,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber
    });
    doc.save().then( x => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
});

routers.get('/user',(req,res,next)=>{
    userDetail.find({email:req.query.username,password:req.query.password},(err,resp) => {
        let credentials = req.query; 
        const token = jwt.sign({credentials}, 'my_secret_key')
        if(!err && resp){
            console.log(resp);
            res.send({auth:true, token:token, data:resp[0]});
        }else{
            console.log(err);
        }
    })
})

//module.exports = routers;
//routers.ensureToken = ensureToken();
module.exports = routers;