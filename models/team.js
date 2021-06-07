const Sequelize = require('sequelize');

module.exports = class Team extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      introduce: {
        type: Sequelize.STRING(500),
        allowNull: false,
      }

    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Team',  
      tableName: 'team',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // db.User.hasMany(db.Post);
    // db.User.belongsToMany(db.User, {
    //   foreignKey: 'followingId',
    //   as: 'Followers',
    //   through: 'Follow',
    // });
    // db.User.belongsToMany(db.User, {
    //   foreignKey: 'followerId',
    //   as: 'Followings',
    //   through: 'Follow',
    // });
  }
};

