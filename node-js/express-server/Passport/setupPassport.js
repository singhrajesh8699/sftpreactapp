var JwtStrategy = require('passport-jwt').Strategy;  
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var Model = require('../models/Sequelize/models.js');
var properties=require('../utils/properties');

module.exports = function(passport) { 
  passport.use(new LocalStrategy(
    function(username, password, done) {
      Model.User.sync({force: false}).then(function () {
        Model.User.findOne({
          where: {
            'username': username
          }
        }).then(function (user) {
          if (user == null) {
           return done(null, false, { message: 'Incorrect credentials.' })
          }
         var hashedPassword = bcrypt.hashSync(password, user.salt)
          if (user.password === hashedPassword) {
           return done(null, user)
          }
          return done(null, false, { message: 'Incorrect credentials.' })
        });
       }); 
      }
  ))

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    Model.User.findOne({
      where: {
        'id': id
      }
    }).then(function (user) {
      if (user == null) {
        done(new Error('Wrong user id.'))
      }
      
      done(null, user)
    })
  })


 var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();//fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = properties.secretKey;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
   Model.User.sync({force: false}).then(function () {
    Model.User.findOne({where: {'id': jwt_payload.id
     }}).then(function (user) {
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
      });
    });
  }));
}
