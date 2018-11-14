let check=require('express-validator/check')
const User=require('../models/User')
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
let config=require('config')

//test
exports.sayhi=(req,res)=>{
    res.status(200).json({message:"how far"})
}
exports.validate=(method)=>{
    switch(method){
        case "signup":{
            return [
            check.body("name","An name is needed").exists().isLength({min:5}),
            check.body("email","A valid email is needed").exists().isEmail(),
            check.body("phone","A phone number is required").exists(),
            check.body("phone","A valid phone number is required").exists().isLength({min:8}),
            check.body("password","A password is required").exists(),
            check.body("password","Password must be at least 5 characters").exists().isLength({min:5})
            ]
        }

        case "signin":{
            return [
                check.check("email","A valid email is needed").exists().isEmail(),
                check.body("password","A password is required").exists(),
                check.body("password","Password must be at least 5 characters").exists().isLength({min:5})
            ]
        }
        case "confirm":{
            return [
                check.body("code","A valid code is required").exists().isLength({min:4})
            ]
        } 

        case "forgot_pass":{
            return [
                check.check("email","A valid email is required").exists().isEmail()
            ]
        }

        case "fchange_pass":{
            return [
                check.check("code","A valid code is required").exists(),
                check.body("new_password","A valid mail is required").exists()
            ]
        }

        case "update":{
            return [
                check.body("name","An name is needed").exists(),
                check.check("email","A valid email is needed").exists().isEmail(),
                check.body("phone","A phone number is required").exists(),
                check.body("phone","A valid phone number is required").exists().isLength({min:8}),
                ] 
        }
    }
}


//sign up function
exports.signup=(req,res)=>{
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return msg;
      };
    var errors=check.validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        return res.status(200).json({code:0,message:"An error occured",errors:errors.array()})
    }
    User.findOne({email:req.body.email}).exec().then(user=>{
        if(user){
            return res.status(200).json({code:0,message:"This user already exists."})
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500)
                    .json({code:0,error:err,message:"An error occurred"})
                }
                else{
                    var user=new User({
                        _id:new mongoose.Types.ObjectId(),
                        name:req.body.name,
                        email:req.body.email,
                        phone:req.body.phone,
                        password:hash,
                        code:Math.floor(Math.random()*90000) + 10000
                    })
                    user.save().then(result=>{
                        //send user a mail
                        const sgMail = require('@sendgrid/mail')
                        sgMail.setApiKey(config.SMS_KEY)
                        const msg = {
                        to: user.email,
                        from: 'swaye407@gmail.com',
                        subject: 'Swaye Confirmation code',
                        html: '<p>Thank you for using swaye, here is your code:'+user.code+'</p>',
                        }
                        sgMail.send(msg)
                        res.status(200).json({code:1,message:"User created successfully",data:user})
                    })
                    .catch(error=>{
                        return res.status(500).json({error:error})
                    })
                }
            })
        }
    })
}

//sign in a user
exports.signin=(req,res)=>{
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return msg;
      };
    var errors=check.validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        return res.status(200).json({code:0,message:"An error occured",errors:errors.array(true)})
    }
    User.findOne({email:req.body.email})
    .exec().then(user=>{
        if(!user){
            return res.status(200).json({code:0,message:"This account does not exist"})
        }else{
            if(user.confirmed!=true){
                return res.status(200).json({code:0,message:"This account has not been confirmed"}) 
            }
            bcrypt.compare(req.body.password,user.password,(err,result)=>{
                if(err){
                    return res.status(200).json({code:0,message:"An error occurred"})
                }
                if(result){
                    const token=jwt.sign({email:user.email,userId:user._id},config.JWT,{
                        expiresIn:"24h"
                    })
                    return res.status(200).json({code:1,message:"Signin successfull",token:token}) 
                }
                else{
                    return res.status(200).json({code:0,message:"Authentication failed"})
                }
            })
        }
    })
    .catch(error=>{
        return res.status(500).json({code:0,message:"An error occurred"})
    })
}


//confirms a user account with a code
exports.confirm=(req,res)=>{
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return msg;
      };
    var errors=check.validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(200).json({code:0,message:"An error occured",errors:errors.array(true)})
    }
    User.findOne({code:req.body.code}).exec()
    .then(user=>{
        if(user){
            user.confirmed=true
            user.save().then(result=>{
             
                res.status(200).json({code:1,message:"Your account has been confirmed",data:user})
            })
            .catch(error=>{
               
                res.status(500).json({error:error,code:0,message:"An error occurred"})
            })
        }else{
            res.status(200).json({code:0,message:"This code does not exist"}) 
        }
    })
    .catch(error=>{
        
        return res.status(500).json({error:error})
    })
}

exports.forgot_pass=(req,res)=>{
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return msg;
      };
    var errors=check.validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(200).json({code:0,message:"An error occured",errors:errors.array(true)})
    }
    User.findOne({email:req.body.email}).exec()
    .then(user=>{
        if(user){
            user.code=Math.floor(Math.random()*90000) + 10000
            user.save().then(result=>{
             
                return res.status(200).json({code:1,message:"A meail has been sent with your code",data:user})
            })
            .catch(error=>{
                
                return res.status(500).json({code:0,message:"An error occured"})
            })
        }
        else{
            return res.status(200).json({code:0,message:"This email does not exist"})
        }
    })
    .catch(error=>{
        return res.status(500).json({code:0,message:"An error occured",error:error})
    })
}


exports.fchange_pass=(req,res)=>{
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return msg;
      };
    var errors=check.validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(200).json({code:0,message:"An error occured",errors:errors.array(true)})
    }
    User.findOne({code:req.body.code}).exec()
    .then(user=>{
        if(user){
            bcrypt.hash(req.body.new_password,10,(err,hash)=>{
                if(err){
                    console.log(err)
                    return res.status(500).json({error:err,code:0})
                }
                user.password=hash
                user.save().then(result=>{
                    return res.status(200).json({code:1,message:"Your password has been changed",data:user})
                })
                .catch(error=>{
                    console.log(error)
                    return res.status(500).json({code:0,error:error,message:"An error occurred"})
                })
            })
        }
    })
    .catch(error=>{
        return res.status(500).json({code:0,error:error,message:"An error occurred"}) 
    })
}

//get a signed in user
//protected function
exports.user=(req,res)=>{
    var user_id=req.userData.userId
    if(!user_id){
        return res.status(200).json({code:0,message:"An error occured"})
    }
    User.findOne({_id:user_id})
    .select("name email phone")
    .exec()
    .then(user=>{
        if(user){
            return res.status(200).json({code:1,data:user})
        }
        else{
            return res.status(200).json({code:0,message:"This account does not exist"})
        }
    })
    .catch(error=>{
        return res.status(500).json({code:0,error:error})
    })
}

exports.users=(req,res)=>{
    User.find({})
    .select("name email phone")
    .exec()
    .then(user=>{
        if(user){
            return res.status(200).json({code:1,data:user})
        }
        else{
            return res.status(200).json({code:0,message:"This account does not exist"})
        }
    })
    .catch(error=>{
        return res.status(500).json({code:0,error:error})
    })
}

exports.update=(req,res)=>{
    var user_id=req.userData.userId
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return msg;
    };
    var errors=check.validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(200).json({code:0,message:"An error occured",errors:errors.array(true)})
    }
    User.updateOne({_id:user_id},{$set:{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    }}).exec()
    .then(doc=>{
        return res.status(200).json({code:1,message:"Update successfull"})
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({code:0,message:"An error occurred",error:err})
    })
}


