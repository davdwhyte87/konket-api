'use strict';

var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user');
var Auth = require('../middleware/auth');

router.get('/', Auth, UserController.user);
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
router.post('/confirm', UserController.confirm);
router.post('/forgot_pass', UserController.forgot_pass);
router.post('/fchange_pass', UserController.fchange_pass);
module.exports = router;
//# sourceMappingURL=user.js.map