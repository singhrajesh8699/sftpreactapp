let userId='';
let cname='';
let properties=require('../utils/properties');
let zyloSourceAuthQuery =require('../models/Sequelize/zyloSourceAuthQuery');
var google = require('googleapis');
var googleDrive = require('google-drive')
var googleAuth = require('google-auth-library');
var OAuth2 = google.auth.OAuth2;
let clientId=properties.gdclientid;
let secretKey=properties.gdsecretKey;
let oauth2Client = new OAuth2(
  properties.gdclientid,
  properties.gdsecretKey,
  properties.gdcallbackurl
);

google.options({
  auth: oauth2Client
});




module.exports.oauth2Client=function(req,res){
	userId=req.body.userId;
	cname=req.body.cname;

	//google.options({version: 'v3',auth: oauth2Client});

	var scopes = [
	  'https://www.googleapis.com/auth/drive',
	  'https://www.googleapis.com/auth/drive.file',
	  'https://www.googleapis.com/auth/drive.metadata'
	];

	var url = oauth2Client.generateAuthUrl({
	  scope: scopes,
	  access_type: 'offline',
	  prompt:'consent'
	});
	res.send(JSON.stringify({ url:url}));
}

module.exports.oauth2Callback=function(req,res){
    var code=req.query.code;
    oauth2Client.getToken(code, function (err, tokens) {
	  if (err) {
	     res.send("Token not received")
	  }else{
	  	var config={
	    	accessToken:tokens.access_token,
	    	refreshToken:tokens.refresh_token,
	        clientId:clientId,
	        clientSecret:secretKey,
	        redirectUri:properties.gdcallbackurl,
	        fileId:[]
        }
	    var zyloData={
	    	source_type:'googledrive',
	    	config:config,
	    	status:1,
	    	client_id:userId,
	    	client_name:cname,
	    }
        res.render('googlefilepicker',{zyloData:zyloData});
	  	
	  }
	});
}

module.exports.gdZyloRecords=function(req,res){
	zyloSourceAuthQuery.findRecords(req.body.zyloData,res)
}