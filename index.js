const customers = require('./routers/customer');
const products = require('./routers/products')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const URI = 'mongodb://localhost:27017/AngularCRUD'

mongoose.connect(URI).then(x => {
    console.log('Success');
}).catch(err => {
    console.log(err);
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    req.headers['content-type'] = 'application/json';
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(customers);
app.use(products);

app.listen((process.env.PORT ||3200), (req,res) =>{
    console.log("success run");
});