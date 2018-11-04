'use strict';

var express = require('express');
var router = express.Router();
var ContactController = require('../controllers/contact');
var Auth = require('../middleware/auth');

router.post('/', Auth, ContactController.add);
router.get('/', Auth, ContactController.contact);
router.post('/:id/edit', Auth, ContactController.edit);
module.exports = router;
//# sourceMappingURL=contact.js.map