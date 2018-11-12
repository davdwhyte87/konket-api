var express=require('express');
var router=express.Router()
const UserController=require('../controllers/user')
const Auth=require('../middleware/auth')
let check=require('express-validator/check')

router.get('/',Auth,UserController.user);
router.get('/all',UserController.users);
router.post('/',UserController.validate('signup'),UserController.signup)
router.post('/signin',UserController.validate('signin'),UserController.signin)
router.post('/confirm',UserController.validate('confirm'),UserController.confirm)
router.post('/forgot_pass',UserController.validate('forgot_pass'),UserController.forgot_pass)
router.post('/fchange_pass',UserController.validate('fchange_pass'),UserController.fchange_pass)
router.post('/update',UserController.validate('update'),Auth,UserController.update)
module.exports=router;