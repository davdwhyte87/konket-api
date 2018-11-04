const mongoose=require('mongoose')

const contactSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,required:true},
    phone:{type:Number,required:true},
    email:{type:String},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
})

module.exports=mongoose.model('Contact',contactSchema)