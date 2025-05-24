const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index');
const Abonne = require('./abonne');
const Operateur = require('./operateur');
const DateReclamation = require('./date');

class Reclamation extends Model {}

Reclamation.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titre: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  categorie: { type: DataTypes.ENUM('Gaz', 'Électricité', 'Facturation'), allowNull: false },
  statut: { type: DataTypes.ENUM('en_attente', 'en_cours', 'resolue', 'rejetee'), allowNull: false, defaultValue: 'en_attente' },
  priorite: { type: DataTypes.ENUM('haute', 'moyenne', 'basse'), allowNull: false, defaultValue: 'moyenne' },
  date_creation: { type: DataTypes.DATE, allowNull: true },
  date_modification: { type: DataTypes.DATE, allowNull: true }
}, {
  sequelize,
  modelName: 'Reclamation',
  tableName: 'reclamations',
  timestamps: false
});

// Relations
Reclamation.belongsTo(Abonne, { foreignKey: 'abonne_id' });
Reclamation.belongsTo(Operateur, { foreignKey: 'operateur_id' });
Reclamation.hasOne(DateReclamation, { foreignKey: 'reclamation_id', as: 'DateReclamation' });

module.exports = Reclamation;