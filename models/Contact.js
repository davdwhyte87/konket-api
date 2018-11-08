const mongoose=require('mongoose')

const contactSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,required:true},
    phone:{type:Number,required:true},
    email:{type:String},
    address:{type:String},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    created_at:{type:Date,default:Date.now}
})

contactSchema.pre('save',next=>{
    now=new Date()
    if(!this.created_at){
        this.created_at=now
    }
    next()
})
module.exports=mongoose.model('Contact',contactSchema)