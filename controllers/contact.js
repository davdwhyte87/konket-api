const Contact=require('../models/Contact')
const mongoose=require('mongoose')
let check=require('express-validator/check')

exports.validate=(method)=>{
    switch(method){
        case "add":{
            return [
            check.body("name","A name is needed").exists().isLength({min:1}),
            check.body("phone","A phone number is required").exists(),
            check.body("phone","A valid phone number is required").exists().isLength({min:8})
            ]
        }

        case "update":{
            return [
                check.body("name","An name is needed").exists(),
                check.check("email","A valid email is needed").exists().isEmail(),
                check.body("phone","A phone number is required").exists(),
                check.body("phone","A valid phone number is required").exists().isLength({min:8})
                ] 
        }
    }
}

exports.add=(req,res)=>{
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return msg;
      };
    var errors=check.validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        return res.status(200).json({code:0,message:"An error occured",errors:errors.array()})
    }
    var user_id=req.userData.userId
    Contact.findOne({email:req.body.email,phone:req.body.phone}).exec()
    .then(contact=>{
        if(contact){
            return res.status(200).json({code:0,message:"This contact already exists"})
        }
        var contact=Contact({
            _id:new mongoose.Types.ObjectId(),
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            address:req.body.address,
            user:user_id
        })
        contact.save().then(contact=>{
            res.status(200).json({code:1,message:"Contact added successfully",data:contact})
        })
        .catch(error=>{
            res.status(500).json({code:0,message:"An error occurred",error:error})
        })
    })
    .catch(error=>{
        res.status(500).json({code:0,message:"An error occured",error:error})
    })
}

function seed(){
    contacts=[
        {name:"Dayo lammo",email:"dayoolm83@gmail.com",phone:"092038944"},
        {name:"Martin4",email:"45gmartin@gmail.com",phone:"0808377493"},
    ]

    for(contact of contacts){
        var contact=new Contact(contact)
        contact.save()
    }
}

exports.contact=(req,res)=>{
    var user_id=req.userData.userId
    Contact.find({user:user_id}).exec().then(contacts=>{
        return res.status(200).json({code:1,data:contacts})
    })
    .catch(error=>{
        console.log(error)
        return res.status(500).json({code:0,message:"An error occured"})
    })
}

exports.signle_contact=(req,res)=>{
    var contact_id=req.params.id 
    var user_id=req.userData.userId
    Contact.findOne({_id:contact_id,user:user_id}).exec().then(contact=>{
        if(contact){
            return res.status(200).json({code:1,data:contact})
        }
        else{
            return res.status(200).json({code:0,message:"This contact does not exist"})
        }
    })
    .catch(error=>{
        console.log(error)
        return res.status(500).json({code:0,message:"An error occured"})
    })
}

exports.edit=(req,res)=>{
    var c_id=req.params.id 
    var user_id=req.userData.userId
    Contact.updateOne({_id:c_id,user:user_id},{$set:{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    }}).exec()
    .then(contact=>{
        console.log(contact)
        return res.status(200).json({code:1,message:"Conatact data updated"})
    })
    .catch(erro=>{
        console.log(erro)
        return res.status(500).json({code:0,message:"An error occurred",error:erro})
    })
}

exports.delete=(req,res)=>{
    var contact_id=req.params.id
    var user_id=req.userData.userId 
    Contact.deleteOne({_id:contact_id,user:user_id}).then((doc)=>{
        console.log(doc)
        return res.status(200).json({code:1,message:"Conatact deleted!"})
    })
    .catch(error=>{
        console.log(error)
        return res.status(200).json({code:0,message:"An error occured"})
    })
}