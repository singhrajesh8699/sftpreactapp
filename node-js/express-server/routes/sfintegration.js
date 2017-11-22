var jsforce = require('jsforce');
var sf = require('node-salesforce');
var fs = require('fs');
var logger = require("../logger");
var rimraf = require('rimraf');
var https = require('https');
var request = require("request");
var converter = require('json-2-csv');
let aws =require('../models/AWSConfiguration/aws');
let s3 = new aws.AWS.S3();
var streamingS3 = require('streaming-s3');
let oauth2={};
let SobjectNm='';
let userId='';
let cname='';
let properties=require('../utils/properties');
let zyloSourceAuthQuery =require('../models/Sequelize/zyloSourceAuthQuery');
let clientId;
let secretKey;

module.exports.login=function(req, res,next){
	oauth2={};
	SobjectNm='';
	logger.debug("salesforce login:.........");
    userId=req.body.userId;
    cname=req.body.cname;
    clientId=properties.sfclientid;
    secretKey=properties.sfclientid;
    oauth2 = new sf.OAuth2({
      loginUrl:properties.saleforcelogin, 	
      clientId : properties.sfclientid,
	  clientSecret : properties.sfsecretkey,
	  redirectUri : properties.sfcallbackUrl,
	});    
   res.send(JSON.stringify({ url:oauth2.getAuthorizationUrl({ scope : 'api id web refresh_token' })}));
};


module.exports.callback=function(req, res) {
  var conn = new sf.Connection({ oauth2 : oauth2 });
  var code = req.param('code');
  conn.authorize(code, function(err, userInfo) {
    if (err) { 
       logger.debug("salesforce callback error",err);
        console.log(error)
	  	res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("Something Broken!");
	    res.end(); 
    }
	logger.debug("salesforce accessToken :"+conn.accessToken+" refreshToken:"+conn.refreshToken+" instanceUrl:"+conn.instanceUrl);
    var config={
    	accessToken:conn.accessToken,
    	refreshToken:conn.refreshToken,
        clientId:clientId,
        clientSecret:secretKey,
        redirectUri:properties.sfcallbackUrl
       }
    var zyloData={
    	source_type:'salesforce',
    	config:config,
    	status:1,
    	client_id:userId,
    	client_name:cname
    }
    zyloSourceAuthQuery.findRecords(zyloData,res);

     /*res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<label id="raj">Something Broken!</label>');
	res.end();

    var options={
    	method: 'GET',
  		url: conn.instanceUrl+'/services/data/v40.0/sobjects/'+SobjectNm+'/listviews',
  		qs: { access_token: conn.accessToken},
			  headers: 
			   { 'cache-control': 'no-cache',
			      authorization: 'Bearer '+conn.accessToken, 
			   } 
		    };
	    
    request(options, function (error, response, body) {
	 if (error)
	  {
	  	logger.debug("salesforce 1st api call error:",error);
	  	console.log(error)
	  	res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("Something Broken!");
	    res.end(); 
	  }
      
      var data=JSON.parse(body)
	    data.listviews.map(function(records){
	      	if(records.developerName=="MyAccounts" || records.developerName=="AllOpenLeads"){
	      	    options.url=conn.instanceUrl+records.resultsUrl;
	      	    request(options, function (error, response, innerbody){
	      	  	    if (error){ 
	      	  	        console.log(error) 
	      	  	    	logger.debug("salesforce 2st api call error:",error);
					  	res.writeHead(200, {'Content-Type': 'text/html'});
						res.write("Something Broken!");
					    res.end(); 
	      	  	    }
	      	  	    var jsonData=JSON.parse(innerbody);
				    var mainArr=[];
			        	jsonData.records.map(function(colm){
							var newObj = new Object();
							colm.columns.map(function(obj){
					            newObj[obj.fieldNameOrPath] = obj.value;
					        });
							mainArr.push(newObj);
						});	
					fs.existsSync(__dirname+'/uploads') || fs.mkdirSync(__dirname+'/uploads');
                    converter.json2csv(mainArr,function(err, csv){
				        if(err){
				          console.log('Error jsonexport:', err);
				          fs.unlink(__dirname+'/uploads/'+SobjectNm+'.csv') 	
				          logger.debug("Error while convert from json to csv",err);
				          res.writeHead(200, {'Content-Type': 'text/html'});
						  res.write("Error while convert from json to csv!");
					      res.end();  	
				        }
				        fs.writeFile(__dirname+'/uploads/'+SobjectNm+'.csv',csv, function(err) {
						    if(err) {
						        return console.log(err);
						    }
						    console.log("The file was saved!");
						    uploadToS3(SobjectNm+'.csv',res);
						}); 
                          
					});
	      		});
	      	}
	    })
	});*/

	
  });
};

function uploadToS3(fileName,res){   
 try{
 	var ContentType='text/csv';
	var readerStream = fs.createReadStream(__dirname+'/uploads/'+fileName);
	var dt = new Date();
    var currDat = dt.toUTCString();	
	
	var uploader=new streamingS3(readerStream, {accessKeyId: properties.accessKeyId, secretAccessKey:properties.secretAccessKey },
	  {
	    Bucket: properties.bucketName,
	    Key: fileName.split('.')[0]+' '+currDat+'/'+fileName,
	    ContentType:ContentType
	  });
 	uploader.begin();

 	uploader.on('finished', function (resp, stats) {
	  console.log("salesforce download");
	  var dashBoardData={
   	  	userId:userId,
   	  	fileName:fileName,
   	  	source:"Salesforce",
   	  	destination:"ZyloTech Platform",
   	  	date:currDat,
   	  	size:stats.size+'bytes',
   	  	status:"Upload"
   	  }
   	  var dashBoard = require('../models/Sequelize/insertDashBoard.js');  
   	  dashBoard.insertDashBoard(dashBoardData);
   	  fs.unlink(__dirname+'/uploads/'+fileName);
   	  res.writeHead(200, {'Content-Type': 'text/html'});
	  res.write(fileName.split('.')[0]+' '+"Data successfully uploaded to Zylotech Platform!");
      res.end();
	});
	uploader.on('error', function (err) {
	  console.log(err);
   	  fs.unlink(__dirname+'/uploads/'+fileName);
   	  res.writeHead(200, {'Content-Type': 'text/html'});
	  res.write("Something Broke!");
      res.end();
	 });
}catch(error){
	console.log(error)
}
}

