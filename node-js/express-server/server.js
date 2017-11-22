var express = require('express');
var cors = require('cors');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var winston = require('winston');
var logger = require("./logger");
var app = express();
var methodOverride = require('method-override');
var setupPassport = require('./Passport/setupPassport')(passport);


try{
    var port=process.env.SFTP_SERVER_PORT || 8080;
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/public/html');
	//app.use(express.static(path.join(__dirname, 'public')));
	app.use(cors());
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json()); 
	app.use(cookieParser());
    app.use(session({ secret: '4564f6s4fdsfdfd', resave: false, 
    	              saveUninitialized: false,cookie:{maxAge:1000*60}}));
    app.use(passport.initialize())
    app.use(passport.session())
var routes = require('./routes/routes.js')(express,passport);
	app.use('/',routes);
    app.use(methodOverride())
    app.use(function (err, req, res, next) {
	  console.error(err.stack)
	  res.status(500).send('Something broke!')
	})

    app.get('/',function(req,res){
       res.send('hello')
    }); 
	
	app.listen(port,function(){
		console.log("server started at port",port);
	});
 }
catch(err){
  console.log(err)
}

var backend_port = process.env.SFTP_SERVER_PORT || 8080;
app.listen(backend_port, () => {
  console.log('listening on port ', backend_port);
})
