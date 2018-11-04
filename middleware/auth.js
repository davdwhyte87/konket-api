const jwt=require('jsonwebtoken')
module.exports=(req,res,next)=>{
    try{
        const decode=jwt.verify(req.headers['token'],process.env.JWT)
        req.userData=decode
        next()
    }
    catch(error){
        console.log(error)
        return res.status(500).json({code:0,message:"An error occured"})
    }
    
}