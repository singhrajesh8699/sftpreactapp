var express = require('express');
var properties=require('../utils/properties.js');
var logger = require("../logger");
var router = express.Router();
const path = require('path');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: __dirname+'/uploads/' });
var streamingS3 = require('streaming-s3');
var zlib = require('zlib');
var AWS = require('aws-sdk');
var aws =require('../models/AWSConfiguration/aws')
var rimraf = require('rimraf');
var s3 = new aws.AWS.S3();
var crypto = require('crypto');
var request = require("request");
var async = require('async');


module.exports.getSObjectList=function(req,res){
	var params = {Bucket: properties.bucketName};
	s3.listObjects(params, function(err, data) {
	   if (err) console.log(err, err.stack); 
	   else {
	   	   res.send(data.Contents);
	    }   
    })
}

module.exports.s3download=function(req, res){
    var folder= req.body.file;
    var s3 = new AWS.S3();
    var params = { Bucket: properties.bucketName,
                   Key:folder,
                   Expires: 3600*24};
    var url = s3.getSignedUrl('getObject', params);
    res.send({url:url});
};


fetchUrl=function(files,path,filetype,filesize,clientId,currDat){
  return new Promise(function(resolve,reject){
    var url=[];
    var i=0;
    for(i in files){
      var params = {
         Bucket: properties.bucketName,
         Key:path+files[i],
         Expires: 3600*24,
         ContentType: filetype[i],
         ACL: 'public-read'
       };
      s3.getSignedUrl('putObject', params, function(err, data) {
          if(err){
            console.log(err)
            res.send(JSON.stringify({serverdata:'something broke'}));
          }else{
            url.push(data);
          }
      });
    }
    if(i==files.length-1){
     resolve(url);
    }
  })
}



module.exports.browserUpload=function(req,res){
	var files=req.body.files;
  var path=req.body.path;
	var filetype=req.body.filetype;
	var filesize=req.body.size;
	var clientId=req.body.clientId;
  var currDat=req.body.currDat; 
  fetchUrl(files,path,filetype,filesize,clientId,currDat).then(function(resolve){
    res.send({url:resolve})
  })
 }


