var Sequelize = require('sequelize');

var attributes = {
  cname: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
    allowNull: false,
    unique: true
  },
  gd_shared_folder: {
    type: Sequelize.STRING,
    defaultValue:null,
    allowNull: true,
  },
  dropbox_shared_folder: {
    type: Sequelize.STRING,
    defaultValue:null,
    allowNull: true,
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  resetPasswordToken: {
     type: Sequelize.TEXT,
     allowNull: true,
  },
  resetPasswordExpires: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  salt: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  resetsalt:{
    type: Sequelize.TEXT,
    allowNull: true
  },
  roles:{
    type: Sequelize.ENUM,
    values: ['admin', 'client'],
    defaultValue:'client'
  },
  db_name:{
    type: Sequelize.UUID,
    allowNull: false
  },
  description:{
    type: Sequelize.TEXT,
    allowNull: true
  },


}


var options = {
  freezeTableName: true,
}

module.exports.attributes = attributes;
module.exports.options = options;

