var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var app = express();
var quickstart= require('./quickstart');
var googleAuth=require('./googleAuth');
var dropboxAuth=require('./dropboxAuth');
var onedriveAuth=require('./onedriveAuth');

try{
    var port=process.env.SFTP_SERVER_PORT || 3000
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/');
	//app.use(express.static(path.join(__dirname, 'public')));
	app.use(cors());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json()); 
	app.use(cookieParser());
    app.use(session({ secret: '4564f6s4fdsfdfd', resave: false, 
    	              saveUninitialized: false,cookie:{maxAge:1000*60}}));

    app.get('/',function(req,res){
    	res.send("hello")
    })
    app.get('/gdaccess',quickstart); 
    app.get('/googleauth',googleAuth.oauth2Client); 
    app.get('/googledrive',googleAuth.oauth2Callback)
    app.get('/gdfilepicker',googleAuth.filepicker)

    app.get('/dropboxclient',dropboxAuth.dropboxClient)
    app.get('/dropboxauth',dropboxAuth.dropboxCallBack)

    app.get('/onedriveclient',onedriveAuth.onedriveClient)
    app.get('/onedriveauth',onedriveAuth.onedriveCallBack)
	
	app.listen(port,function(){
		console.log("server started at port",port);
	});
 }
catch(err){
  console.log(err)
}

