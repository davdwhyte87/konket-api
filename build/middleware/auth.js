'use strict';

var jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    try {
        var decode = jwt.verify(req.headers['token'], process.env.JWT);
        req.userData = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ code: 0, message: "An error occured" });
    }
};
//# sourceMappingURL=auth.js.map