var express=require('express')
var app=express()
var user_route=require('./routes/user')
const morgan=require('morgan')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const contact_routes=require('./routes/contact')
var babel = require('babel-core')

babel.transform("code")
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','*')
    next();
})


mongoose.connect(process.env.DB_URL_L,{useNewUrlParser:true});
console.log(process.env.DB_URL)
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use('/user',user_route)
app.use('/contact',contact_routes)
app.use(morgan('dev'))
module.exports=app