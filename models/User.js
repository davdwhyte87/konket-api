const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:Number,required:true},
    password:{type:String,required:true},
    confirmed:{type:Boolean,required:true,default:false},
    code:{type:Number,required:true},
    created_at:{type:Date,default:Date.now}
})

userSchema.pre('save',next=>{
    now=new Date()
    if(!this.created_at){
        this.created_at=now
    }
    next()
})

module.exports=mongoose.model("User",userSchema)