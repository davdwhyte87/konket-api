var express=require('express');
var router=express.Router()
const ContactController=require('../controllers/contact')
const Auth=require('../middleware/auth')

router.post('/',Auth,ContactController.add)
router.get('/',Auth,ContactController.contact)
router.post('/:id/edit',Auth,ContactController.edit)
module.exports=router;