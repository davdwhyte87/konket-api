const jwt=require('jsonwebtoken')
let config=require('config')
module.exports=(req,res,next)=>{
    if(req.headers['token']==""){
        return res.status(200).json({code:0,message:"A token is needed"}) 
    }
    if(!req.headers['token']){
        return res.status(200).json({code:0,message:"A token is needed"}) 
    }
    try{
        const decode=jwt.verify(req.headers['token'],config.JWT)
        req.userData=decode
        next()
    }
    catch(error){
        return res.status(500).json({code:0,message:"An error occured"})
    }
    
}