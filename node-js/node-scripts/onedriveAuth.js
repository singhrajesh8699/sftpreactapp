var ClientOAuth2 = require('client-oauth2')
 
var githubAuth = new ClientOAuth2({
  clientId: 'e42f7594-5162-403a-9ca1-56d879cc7cc1',
  clientSecret: 'a28AD6iFZEvKty2h9bjijMe',
  accessTokenUri: 'https://login.live.com/oauth20_token.srf',
  authorizationUri: 'https://login.live.com/oauth20_authorize.srf',
  redirectUri: 'http://localhost:3000/onedrive',
  scopes:['wl.offline_access,onedrive.readwrite']
})


module.exports.onedriveClient=function(req,res){
  var uri = githubAuth.code.getUri()
  res.redirect(uri)
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
      return res.send(user.accessToken)
    })
}
