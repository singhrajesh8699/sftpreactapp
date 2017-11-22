var crypto = require('crypto'),
    request = require('request'),
	url = require('url');
var express = require('express');
var app = express();
let userId='';
let cname='';
let properties=require('../utils/properties');
let zyloSourceAuthQuery =require('../models/Sequelize/zyloSourceAuthQuery');
let clientId;
let secretKey;

module.exports.dropboxClient=function (req, res) {
	userId=req.body.userId;
	cname=req.body.cname;
	files=req.body.files;
	clientId=properties.dbclientid;
	secretKey=properties.dbclientid;
	/*res.send(JSON.stringify({ url:url.format({
		protocol: 'https',
		hostname: 'www.dropbox.com',
		pathname: '1/oauth2/authorize',
		query: {
			client_id: clientId,
			response_type: 'code',
			redirect_uri: properties.dbcallbackurl
		}
	})}));*/

	var config={
	        clientId:clientId,
	        clientSecret:secretKey,
	        files:files,
	        redirectUri:properties.dbcallbackurl
        }
	    var zyloData={
	    	source_type:'dropbox',
	    	config:config,
	    	status:1,
	    	client_id:userId,
	    	client_name:cname
	    }
	    zyloSourceAuthQuery.findRecords(zyloData,res);
}

module.exports.dropboxCallBack=function (req, res) {

	if (req.query.error) {
		return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
	}
	// exchange access code for bearer token
	request.post('https://api.dropbox.com/1/oauth2/token', {
		form: {
			code: req.query.code,
			grant_type: 'authorization_code',
			redirect_uri: properties.dbcallbackurl
		},
		auth: {
			user: clientId,
			pass: secretKey
		}
	}, function (error, response, body) {
		var data = JSON.parse(body);
		if (data.error) {
			return res.send('ERROR: ' + data.error);
		}

		// extract bearer token
		var token = data.access_token;
        console.log(data)

        var config={
	    	accessToken:data.access_token,
	    	refreshToken:data.refresh_token,
	        clientId:clientId,
	        clientSecret:secretKey,
	        redirectUri:properties.dbcallbackurl
        }
	    var zyloData={
	    	source_type:'dropbox',
	    	config:config,
	    	status:1,
	    	client_id:userId,
	    	client_name:cname
	    }
	    zyloSourceAuthQuery.findRecords(zyloData,res);
	});
}