const customers = require('./routers/customer');
const products = require('./routers/products')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const URI = 'mongodb+srv://sreeja:Sreeja2998@cluster0.cnj96.mongodb.net/?retryWrites=true&w=majority'; //'mongodb://localhost:27017/AngularCRUD'//

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
    res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "authorization, content-type, xsrf-token");
    res.header("Access-Control-Expose-Headers", "xsrf-token");
    next();
  });
app.use(customers);
//app.use(products);

app.listen((process.env.PORT ||3200), (req,res) =>{
    console.log("success run");
});