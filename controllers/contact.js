const Contact=require('../models/Contact')
const mongoose=require('mongoose')


exports.add=(req,res)=>{
    req.check("name","Name is required").isString().exists()
    req.check("phone","Phone number is required").exists()
    req.check("phone","You need a valid phone number").isLength({min:8})
    var errors=req.validationErrors()
    if(errors){
        console.log(errors)
        return res.status(200).json({code:0,message:"An error occured",errors:errors})
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