var express=require('express');
var app=express();
var user_route=require('./routes/user');
const morgan=require('morgan');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const contact_routes=require('./routes/contact');
var babel = require('babel-core');
var expressValidator = require('express-validator');
process.env["NODE_CONFIG_DIR"] ="./config/";
let config=require('config');

app.use(expressValidator());
babel.transform("code");
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','*')
    next();
});


mongoose.connect(config.DB_URL,{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/user',user_route);
app.use('/contact',contact_routes);
app.use(morgan('dev'));
module.exports=app