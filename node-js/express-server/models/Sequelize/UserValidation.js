var Model = require('./models');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var request = require("request");
var aes256 = require('nodejs-aes256');


module.exports.getUserList=function(req,res){
  Model.User.sync({force: false}).then(function () {
   Model.User.findAll({})
    .then(function(result) {
      if(result.length==0){
        res.send([]);
      }else{
        var userlist=JSON.parse(JSON.stringify(result));
        res.send(userlist);
      }
    }).catch(function(err){
      console.log(err)
      res.send(JSON.stringify({"error":"database error"}));
    });
  });  
};

module.exports.validateCName=function(req,res){
  Model.User.sync({force: false}).then(function () {
   Model.User.findAll({
       where: {
          cname: req.body.cname,
        }
    }).then(function(result) {
      if(result.length==0){
        res.send(JSON.stringify({"uniqcname":true}));
      }else{
        res.send(JSON.stringify({"uniqcname":false}));
      }
    }).catch(function(err){
      console.log(err)
      res.send(JSON.stringify({"error":"database error"}));
    });
  });  
};

module.exports.validateUser=function(req,res){
  Model.User.sync({force: false}).then(function () {
   Model.User.findAll({
       where: {
          username: req.body.username,
        }
    }).then(function(result) {
    	if(result.length==0){
        res.send(JSON.stringify({"uniquser":true}));
    	}else{
    	  res.send(JSON.stringify({"uniquser":false}));
    	}
    }).catch(function(err){
    	console.log(err)
    	res.send(JSON.stringify({"error":"database error"}));
    });
  });  
};

module.exports.validateEmail=function(req,res){
  Model.User.sync({force: false}).then(function () {
   Model.User.findAll({
       where: {
           email: req.body.email,
        }
    }).then(function(result) {
    	if(result.length==0){
        res.send(JSON.stringify({"uniqemail":true}));
    	}else{
    	  res.send(JSON.stringify({"uniqemail":false}));
    	}
    }).catch(function(err){
    	console.log(err)
    	res.send(JSON.stringify({"error":"database error"}));
    });
  });  
};


module.exports.roleAuthorization = function(roles){
    return function(req, res, next){
      Model.User.sync({force: false}).then(function () {
        Model.User.findAll({
          where: {
              username: req.body.username,
            }
          }).then(function(result) {
              
            if(result.length==0){
                res.send(JSON.stringify({allow:false}));
            }else{
              result.map(function(record){
                if(roles.indexOf(record.roles) > -1){
                  res.send(JSON.stringify({allow:true}));
                }else{
                  res.send(JSON.stringify({allow:false}));
                }
              })
            }
          }).catch(function(err){
            res.send(JSON.stringify({"error":"database error"}));
          });
       });   
    }
}


let updateRecords=function(req,res,user){
  var token=req.query.token;
  Model.User.update({password:token,salt:user.resetsalt}, {where: 
     { username:req.query.username} })  
    .then(data => {
      res.send("password changed successfully! your current username and password send to your email.");
      Model.User.findOne({
          where:{username:req.query.username}
        })
        .then(users => {
          var userdata=(JSON.parse(JSON.stringify(users)));
              var to=[userdata.email];
              var from='ZTCDM APP';
              var subject='New Username and Password for ZTCDM APP';
              var text='Hi '+userdata.cname+
                       '\n\n username:'+userdata.username+',password:'+aes256.decrypt(userdata.resetsalt,req.query.password);
              //sendmail(req,res,to,from,subject,text);

              var options = { method: 'POST',
               url: 'http://mail-service.zylotech.com/api/email/send_email',
               headers: { 'content-type': 'application/json' },
               body: { 
                     to: to,
                   from: from,
                subject: subject,
                   text: text },
                json: true };
                 console.log(options)
                request(options, function (error, response, body) {
                  if (error){
                    console.log(error);
                  }
                  console.log(response)
                });
        })
    })
    .catch(err=>{
      res.send("password failed");
    });
}


module.exports.updatePass=function(req,res){
  Model.User.sync({force: false}).then(function () {
   Model.User.findAll({
       where: {
          username:req.query.username,
        }
    }).then(function(result) {
      if(result.length==0){
        res.send(JSON.stringify({"status":"new user"}));
      }else{
        result.map(function(user){
          if(user.resetPasswordToken==req.query.token && user.resetPasswordExpires>=Date.now()){
            updateRecords(req,res,user)
          }else{
            res.send('Token got expire try again!')
          }
        })
        
      }
    }).catch(function(err){
      res.send(JSON.stringify({"error":"database error"}));
   });
  }); 
}

let sendmail=function(req,res,to,from,subject,text){
  var options = { method: 'POST',
   url: 'http://mail-service.zylotech.com/api/email/send_email',
   headers: { 'content-type': 'application/json' },
   body: { 
         to: to,
       from: from,
    subject: subject,
       text: text },
    json: true };

    request(options, function (error, response, body) {
      if (error){
        console.log(error);
        res.send({"status":"passfailed"});
      }else{
        res.send({"status":"passchanged"});
      }
      res.send({"status":"passchanged"});
    });
}


let saveResetPass=function(req,res,user){
  var salt = bcrypt.genSaltSync(10)
  var password=req.body.password;
  var passencrypt = aes256.encrypt(salt, password);
  var resetPasswordToken = bcrypt.hashSync(password,salt);
  var resetPasswordExpires=Date.now() + 3600000;
   Model.User.update({resetPasswordToken:resetPasswordToken,resetPasswordExpires:resetPasswordExpires,resetsalt:salt}, {where: 
     { username:req.body.username} })  
      .then(updatedMax => {
        var URL;
        //URL = 'https://sftp-back.zylotech.com'
          URL = 'http://localhost:8080';
        var to=[user.email];
        var from='ZTCDM APP';
        var subject='Password Reset';
        var text='Hi '+user.cname+
            '\n\nYou are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            URL+'/reset?username='+user.username+'&password='+passencrypt+'&token='+ resetPasswordToken + '\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n';

        sendmail(res,req,to,from,subject,text);
        res.send({"status":"passchanged"});
    })
    .catch(err=>{
      console.log(err)
      res.send({"status":"passfailed"});
    });
}

module.exports.resetpass=function(req,res){
  Model.User.sync({force: false}).then(function () {
   Model.User.findAll({
       where: {
          username:req.body.username,
        }
    }).then(function(result) {
      if(result.length==0){
        res.send(JSON.stringify({"status":"new user"}));
      }else{
        result.map(function(user){
          saveResetPass(req,res,user);
        })
      }
    }).catch(function(err){
      res.send(JSON.stringify({"error":"database error"}));
    });
  }); 
}

