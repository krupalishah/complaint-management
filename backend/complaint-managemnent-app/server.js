var express = require('express');
var cors = require('cors');
var http = require('http');
var app = express();

require('dotenv').config()
var PORT = process.env.PORT;

// require('./Database/schema');
require('./Database/config/database-config');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: "50mb" }));

var expressValidator = require('express-validator');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var userRoutes = require('./Routes/user');
new userRoutes(app);

var complaintRoutes = require('./Routes/complaint');
new complaintRoutes(app);


// var contractRoutes = require('./Routes/contracts');
// new contractRoutes(app);

// var cashkicksRoute = require('./Routes/cashkicks');
// new cashkicksRoute(app);

var httpServer = http.createServer(app);
var server = httpServer.listen(PORT, () => {
    var runningPort = server.address().port;
    console.log("HTTP Server started on : ", runningPort);
});