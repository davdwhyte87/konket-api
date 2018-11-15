var express=require('express');
var router=express.Router()
const ContactController=require('../controllers/contact')
const Auth=require('../middleware/auth')

router.post('/',ContactController.validate('add'),Auth,ContactController.add)
router.get('/',Auth,ContactController.contact)
router.get('/:id',Auth,ContactController.signle_contact)
router.post('/:id/edit',ContactController.validate('update'),Auth,ContactController.edit)
router.get('/:id/delete',Auth,ContactController.delete)
module.exports=router;