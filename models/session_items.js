module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('sessions', {
    id: {
      type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true,
    },
    session_id: {
      type: DataTypes.INTEGER(11), allowNull: false,
    },
    complete: {
      type: DataTypes.BOOLEAN, default: false,
    },
    state: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    volume: {
      type: DataTypes.FLOAT,
    },
  }, {
    tableName: 'session_items',
    underscored: true,
  });
  return model;
};
