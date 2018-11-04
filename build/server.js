'use strict';

var app = require('./app');
var http = require('http');
var port = process.env.PORT || 3000;
var server = http.createServer(app);

server.listen(port);
//# sourceMappingURL=server.js.map