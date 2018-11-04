'use strict';

var express = require('express');
var app = express();
var user_route = require('./routes/user');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var contact_routes = require('./routes/contact');
var babel = require('babel-core');

babel.transform("code");
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/user', user_route);
app.use('/contact', contact_routes);
app.use(morgan('dev'));
module.exports = app;
//# sourceMappingURL=app.js.map