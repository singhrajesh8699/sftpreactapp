var Sequelize = require('sequelize');

var attributes = {
  userId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fileName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  source: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  destination: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  date: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  size: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  operation: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  metaData:{
    type: Sequelize.STRING,
    allowNull: true,
  }
}

var options = {
  freezeTableName: true,
}

module.exports.attributes = attributes
module.exports.options = options