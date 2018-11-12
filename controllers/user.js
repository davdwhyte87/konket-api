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
    console.log("doneen")
    switch(method){
        case "signup":{
            return [
            check.body("name","An name is needed").exists(),
            check.check("email","A valid email is needed").exists().isEmail(),
            check.body("phone","A phone number is required").exists(),
            check.body("phone","A valid phone number is required").exists().isLength({min:8}),
            check.body("password","A password is required").exists(),
            check.body("password","Password must be at least 5 characters")
            ]
        }
    }
}


//sign up function
exports.signup=(req,res)=>{
    // req.check("name","Name is required").isString().exists()
    // req.check("email","You need a valid email").isLength({min:8}).exists()
    // req.check("phone","Phone number is required").exists()
    // req.check("phone","You need a valid phone number").isLength({min:8})
    // req.check("password","A password is required").exists()
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return msg;
      };
    var errors=check.validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(200).json({code:0,message:"An error occured",errors:errors.array(true)})
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
    req.check("email","You need a valid email").isLength({min:8}).exists()
    req.check("password","A password is required").exists()
    var errors=req.validationErrors()
    if(errors){
        return res.status(200).json({code:0,message:"An error occured",errors:errors})
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
    req.check("code","You need a valid code").isLength({min:4}).exists()
    var errors=req.validationErrors()
    if(errors){
        return res.status(200).json({code:0,message:"An error occured",errors:errors})
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
    req.check("email","You need a valid email").isLength({min:8}).exists()
    var errors=req.validationErrors()
    if(errors){
        return res.status(200).json({code:0,message:"An error occured",errors:errors})
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
    req.check("new_password","You need a password").exists()
    req.check("code","You need a valid email").exists()
    var errors=req.validationErrors()
    if(errors){
        console.log(errors)
        return res.status(200).json({code:0,message:"An error occured",errors:errors})
    }
    User.findOne({code:req.body.code}).exec()
    .then(user=>{
        if(user){
            bcrypt.hash(req.body.new_password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({error:err,code:0})
                }
                user.password=hash
                user.save().then(result=>{
                    return res.status(200).json({code:1,message:"Your password has been changed",data:user})
                })
                .catch(error=>{
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
    req.check("name","Name is required").isString().exists()
    req.check("email","You need a valid email").isLength({min:8}).exists()  
    req.check("phone","Phone number is required").exists()
    req.check("phone","You need a valid phone number").isLength({min:8})
    var errors=req.validationErrors()
    if(errors){
        return res.status(200).json({code:0,message:"An error occured",errors:errors})
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


