module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('sessions', {
    id: {
      type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true,
    },
    filename: {
      type: DataTypes.STRING, allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING, allowNull: false,
    },
    import_type: {
      type: DataTypes.STRING, allowNull: false,
    },
    state: {
      type: DataTypes.STRING, allowNull: false,
    },
    delimiter: {
      type: DataTypes.STRING, allowNull: false,
    },
    header: {
      type: DataTypes.BOOLEAN, allowNull: false,
    },
    accumulate: {
      type: DataTypes.BOOLEAN, allowNull: false,
    },
  }, {
    tableName: 'sessions',
    timestamps: true,
    underscored: true,
  });
  return model;
};
