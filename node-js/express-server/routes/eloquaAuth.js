let userId='';
let cname='';
let properties=require('../utils/properties');
let zyloSourceAuthQuery =require('../models/Sequelize/zyloSourceAuthQuery');
let ClientOAuth2 = require('client-oauth2')
let githubAuth; 
let clientId;
let secretKey;
var request = require("request");


module.exports.eloquaClient=function(req,res){
  clientId=properties.elclientid;
  clientSecret=properties.elsecretKey;
 githubAuth = new ClientOAuth2({
  clientId: clientId,
  clientSecret: clientSecret,
  accessTokenUri: 'https://login.eloqua.com/auth/oauth2/token',
  authorizationUri: 'https://login.eloqua.com/auth/oauth2/authorize',
  redirectUri: properties.elcallbackUrl,
  scopes:['full'],
  "grant_type":"authorization_code",
})

  userId=req.body.userId;
  cname=req.body.cname;
  var url= githubAuth.code.getUri()
  res.send(JSON.stringify({ url:url}));
}

module.exports.eloquaCallBack=function(req,res){
   githubAuth.code.getToken(req.originalUrl).then(function (user) {
      console.log(user)
      var config={
          accessToken:user.accessToken,
          refressToken:user.refreshToken,
          clientId:clientId,
          clientSecret:clientSecret,
          redirectUri:properties.elcallbackUrl
        }
      var zyloData={
        source_type:'eloqua',
        config:config,
        status:1,
        client_id:userId,
        client_name:cname
      }
    zyloSourceAuthQuery.findRecords(zyloData,res);

   /*var options={
      method: 'GET',
      url:'https://secure.p02.eloqua.com/api/REST/1.0/assets/contact/fields',
      qs: { access_token: user.accessToken},
        headers: 
         { 'cache-control': 'no-cache',
            authorization: 'Bearer '+user.accessToken, 
         } 
        };*/

   /*var options={
      method: 'GET',
      url:'https://login.eloqua.com/id',
      qs: { access_token: user.accessToken},
        headers: 
         { 'cache-control': 'no-cache',
            authorization: 'Bearer '+user.accessToken, 
         } 
        };     
      
    request(options, function (error, response, body) {
     if (error)
      {
        logger.debug("salesforce 1st api call error:",error);
        console.log(error)
      }
      console.log(body)
  });*/

 });   
}
