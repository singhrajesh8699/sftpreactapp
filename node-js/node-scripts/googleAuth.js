var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
	  '337866883611-318ttm2qmls8t43v3h3jlv8slotdv45k.apps.googleusercontent.com',
	  'cSyysbCMw0bR2OtYalTVOs1i',
	  'http://localhost:3000/googledrive'
	);

	google.options({
	  version: 'v2',	
	  auth: oauth2Client
	});

module.exports.oauth2Client=function(req,res){
	
	var scopes = [
	  'https://www.googleapis.com/auth/plus.me',
	  'https://www.googleapis.com/auth/calendar',
	  'https://www.googleapis.com/auth/drive.metadata.readonly',
	  'https://www.googleapis.com/auth/drive'
	];

	var url = oauth2Client.generateAuthUrl({
	  access_type: 'online',
	  scope: scopes,
	});

	res.redirect(url)
}

module.exports.oauth2Callback=function(req,res){
    var code=req.query.code;
    console.log(code);
    oauth2Client.getToken(code, function (err, tokens) {
	  if (err) {
	     res.send("Token not received")
	  }else{
	  	console.log('tokens :',tokens);
	    res.send("successfully receive token")
	  }
	});
}


module.exports.filepicker=function(req,res){
   res.render('filepicker');
}
