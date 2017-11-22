var jwt = require('jsonwebtoken'); 
var path = require('path');
var fs = require('fs');
var signupController = require('./signupController.js');
var multer  = require('multer');
var upload = multer({ dest: __dirname+'/uploads/' });
const s3=require('./s3integration');
const salesforce=require('./sfintegration');
const dashBoard = require('../models/Sequelize/insertDashBoard.js'); 
const userValidation = require('../models/Sequelize/UserValidation.js');
var properties=require('../utils/properties');
var googleAuth=require('./googleAuth');
var dropboxAuth=require('./dropboxAuth');
var onedriveAuth=require('./onedriveAuth');
var eloquaAuth=require('./eloquaAuth');
var flatfile = require('./flatfile');

module.exports = function(express,passport){
 try {	
   var router = express.Router();

/*//url parameter  localhost:port/p/123
router.get('/p/:id', function(req, res){
 res.send(req.params.id);
});

//query parameter  localhost:port/p?id=123
router.get('/p', function(req, res){
 res.send(req.query.id);
});

router.post('/p', function(req, res){
  var people = [
    { name: 'Dave', location: 'Atlanta' },
    { name: 'Santa Claus', location: 'North Pole' },
    { name: 'Man in the Moon', location: 'The Moon' }
  ];

  var peopleJSON = JSON.stringify(people);
  res.send(peopleJSON);
   
  });*/

	router.post('/rendersignup',userValidation.roleAuthorization(['admin']));

    router.get('/signup',function(req,res){
    	res.render('signup')
    }); 

    router.post('/resetpass',userValidation.resetpass);

	router.get('/reset',userValidation.updatePass);

	router.get('/getuserlist',passport.authenticate('jwt', { session: false }),userValidation.getUserList);

    router.post('/login',function(req, res, next){
      passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return  res.send(JSON.stringify({ status: "failed" })); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      var payload = {id: user.id};
          var token = jwt.sign(payload,properties.secretKey,{
            expiresIn:1000*60*60*24 // in seconds
          });
	      return  res.send(JSON.stringify({ status: "success",userId:user.id,username:user.username,
	      	       cname:user.cname,email:user.email,roles:user.roles,
	      	       token: 'JWT '+token}));
	    });
	  })(req, res, next);
	});

    router.post('/signup',signupController.signup);
                      
	router.get('/home', passport.authenticate('jwt', { session: false }), function(req, res) {
	   res.send('It worked! User id is: ' + req.user.id + '.');
	});

	router.post('/validatecname',passport.authenticate('jwt', { session: false }),userValidation.validateCName);

	router.post('/validateusername',passport.authenticate('jwt', { session: false }),userValidation.validateUser);
    
    router.post('/validateemail',passport.authenticate('jwt', { session: false }),userValidation.validateEmail);
 
	router.post('/salesforcelogin',passport.authenticate('jwt', { session: false }),salesforce.login);

	router.get('/salesforceauth',salesforce.callback);

	//router.post('/uploadFile',passport.authenticate('jwt', { session: false }),upload.single('uploadFile'),s3.s3upload);
    
    router.post('/downloadfile',passport.authenticate('jwt', { session: false }),s3.s3download);

    router.post('/browsers3upload',passport.authenticate('jwt', { session: false }),s3.browserUpload);

    router.get('/sobjectlist',passport.authenticate('jwt', { session: false }),s3.getSObjectList)

	router.post('/dashBoadRecord',passport.authenticate('jwt', { session: false }),dashBoard.getRecords);

	router.post('/eloqualogin',passport.authenticate('jwt', { session: false }),eloquaAuth.eloquaClient);
    router.get('/eloquacallback',eloquaAuth.eloquaCallBack)

	router.post('/googledrivelogin',passport.authenticate('jwt', { session: false }),googleAuth.oauth2Client);
	router.get('/googledrive',googleAuth.oauth2Callback)
	router.post('/gdzylorecords',googleAuth.gdZyloRecords)

	router.post('/dropboxlogin',passport.authenticate('jwt', { session: false }),dropboxAuth.dropboxClient);
	router.get('/dropboxauth',dropboxAuth.dropboxCallBack)

	router.post('/onedrivelogin',passport.authenticate('jwt', { session: false }),onedriveAuth.onedriveClient);
	router.get('/onedriveauth',onedriveAuth.onedriveCallBack)

	router.post('/flatfile',passport.authenticate('jwt', { session: false }),flatfile.flatfileData);

   return router
 }catch(err){
  	console.log(err)
  }
}