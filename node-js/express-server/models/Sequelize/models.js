var UserMeta = require('./User.js'),
    dashBoard = require('./dashBoard.js'),
    zyloSourceAuthTable = require('./zyloSourceAuthTable.js'),
    connection = require('../../DbConnection/sequelize.js');

var User = connection.define('users', UserMeta.attributes, UserMeta.options);
var zyloSourceAuthTable = connection.define('zylo_source_auth', zyloSourceAuthTable.attributes, zyloSourceAuthTable.options);
var DashBoard=connection.define('dashboards', dashBoard.attributes, dashBoard.options);
    
User.hasMany(zyloSourceAuthTable);
 
module.exports.User = User;
module.exports.zyloSourceAuthTable = zyloSourceAuthTable;
module.exports.DashBoard = DashBoard;
