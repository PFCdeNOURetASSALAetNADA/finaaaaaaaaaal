const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index');
const Agent = require('./agent');
const Reclamation = require('./reclamation');

class Affectation extends Model {}

Affectation.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date_affectation: { type: DataTypes.DATE, allowNull: false }
}, {
  sequelize,
  modelName: 'Affectation',
  tableName: 'affectations',
  timestamps: false
});

// Relations
Affectation.belongsTo(Agent, { foreignKey: 'agent_id' });
Affectation.belongsTo(Reclamation, { foreignKey: 'reclamation_id' });

module.exports = Affectation;