const Contact=require('../models/Contact')
const mongoose=require('mongoose')


exports.add=(req,res)=>{
    var user_id=req.userData.userId
    Contact.find({email:req.body.email,phone:req.body.phone}).exec()
    .then(contact=>{
        if(contact.length>0){
            return res.status(200).json({code:0,message:"This contact already exists"})
        }
        var contact=Contact({
            _id:new mongoose.Types.ObjectId(),
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            user:user_id
        })
        contact.save().then(contact=>{
            res.status(200).json({code:1,message:"Contact added successfully",data:contact})
        })
        .catch(error=>{
            console.log(error)
            res.status(500).json({code:0,message:"An error occurred",error:error})
        })
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({code:0,message:"An error occured",error:error})
    })
}

exports.contact=(req,res)=>{
    var user_id=req.userData.userId
    Contact.find({user:user_id}).exec().then(contacts=>{
        return res.status(200).json({code:1,data:contacts})
    })
    .catch(error=>{
        console.log(error)
        return res.status(500).json({code:0,message:"An error n occured"})
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