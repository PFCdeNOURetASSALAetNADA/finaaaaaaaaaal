const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index');

class Agent extends Model {}

Agent.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  prenom: { type: DataTypes.STRING(100), allowNull: false },
  telephone: { type: DataTypes.STRING(20), allowNull: false },
  visibilite: { type: DataTypes.STRING(50), allowNull: false },
  charge_actuelle: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  sequelize,
  modelName: 'Agent',
  tableName: 'agents',
  timestamps: false
});

module.exports = Agent; 