var express=require('express');
var router=express.Router()
const UserController=require('../controllers/user')
const Auth=require('../middleware/auth')

router.get('/',Auth,UserController.user);
router.get('/all',UserController.users);
router.post('/',UserController.signup)
router.post('/signin',UserController.signin)
router.post('/confirm',UserController.confirm)
router.post('/forgot_pass',UserController.forgot_pass)
router.post('/fchange_pass',UserController.fchange_pass)
router.post('/update',Auth,UserController.update)
module.exports=router;