let userId='';
let cname='';
let properties=require('../utils/properties');
let zyloSourceAuthQuery =require('../models/Sequelize/zyloSourceAuthQuery');
var ClientOAuth2 = require('client-oauth2')
let clientId;
let secretKey;
var githubAuth;


module.exports.onedriveClient=function(req,res){
  userId=req.body.userId;
  cname=req.body.cname;
  clientId=properties.odclientid;
  secretKey=properties.odsecretKey;

  githubAuth = new ClientOAuth2({
  clientId: clientId,
  clientSecret: secretKey,
  accessTokenUri: 'https://login.live.com/oauth20_token.srf',
  authorizationUri: 'https://login.live.com/oauth20_authorize.srf',
  redirectUri: properties.odcallbackurl,
  scopes:['wl.offline_access,onedrive.readwrite']
})

  var url= githubAuth.code.getUri()
  res.send(JSON.stringify({ url:url}));
}

module.exports.onedriveCallBack=function(req,res){
   githubAuth.code.getToken(req.originalUrl)
    .then(function (user) {
       /* user.refresh().then(function (updatedUser) {
        console.log(updatedUser !== user) 
        console.log("updatedUser",updatedUser)
      })
 
      user.sign({
        method: 'get',
        url: 'https://login.live.com'
      })*/
      console.log(user.accessToken)
      var config={
          accessToken:user.accessToken,
          clientId:clientId,
          clientSecret:secretKey,
          redirectUri:properties.odcallbackurl,
        }
      var zyloData={
        source_type:'onedrive',
        config:config,
        status:1,
        client_id:userId,
        client_name:cname,
      }
     zyloSourceAuthQuery.findRecords(zyloData,res);

    })
}
