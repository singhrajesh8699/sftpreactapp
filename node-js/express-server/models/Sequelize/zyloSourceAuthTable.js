var Sequelize = require('sequelize');

var attributes = {
  source_type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  config: {
    type: Sequelize.JSON,
    allowNull: true
  },
  status:{
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue:0,
  },
  process_time :{
     type: Sequelize.DATE,
     allowNull: true,
  },
  client_id: {
    type: Sequelize.INTEGER,
    references: {
      model: "users",
      key: "id"
    },
  },
  client_name:{
    type:Sequelize.STRING,
    allowNull: false,
  }
}


var options = {
  freezeTableName: true,
}

module.exports.attributes = attributes;
module.exports.options = options;





