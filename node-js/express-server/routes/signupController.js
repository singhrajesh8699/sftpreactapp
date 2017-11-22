var bcrypt = require('bcrypt');
var Model = require('../models/Sequelize/models.js');
var logger = require("../logger");
const uuidv4 = require('uuid/v4');

module.exports.signup = function(req, res) {
  var cname=req.body.cname;
  var username = req.body.username;
  var password = req.body.password;
  var confirmpwd = req.body.confirmpwd;
  var email=req.body.email;
  var role=req.body.value;
  var salt = bcrypt.genSaltSync(10)
  var hashedPassword = bcrypt.hashSync(password, salt);
  var db_name=uuidv4();

  var newUser = {
    cname:cname,
    username: username,
    salt: salt,
    password: hashedPassword,
    email:email,
    roles:role,
    db_name:db_name,
  }

  Model.User.sync({force: false}).then(function () {
    Model.User.create(newUser).then(function() {
      console.log("user record inserted")
      res.send(JSON.stringify({"insert":true}))
    }).catch(function(error) {
      console.log("user record not inserted",error)
      logger.debug("record not inserted, some issue with inserting data!")
      res.send(JSON.stringify({"insert":false}))
    })
  })
}