const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index');

class DateReclamation extends Model {}

DateReclamation.init({
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true,
    allowNull: false
  },
  reclamation_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: 'reclamations',
      key: 'id'
    }
  },
  abonne_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: 'abonnes',
      key: 'id'
    }
  },
  date_creation: { 
    type: DataTypes.DATE, 
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  date_modification: { 
    type: DataTypes.DATE, 
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'DateReclamation',
  tableName: 'dates',
  timestamps: false
});

module.exports = DateReclamation;