const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index');

class Superviseur extends Model {}

Superviseur.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  mot_de_passe: { type: DataTypes.STRING, allowNull: false },
  region: { type: DataTypes.STRING(50), allowNull: false }
}, {
  sequelize,
  modelName: 'Superviseur',
  tableName: 'superviseurs',
  timestamps: false
});

// Fonction d'authentification spécifique à Superviseur
Superviseur.authentifier = async function(email, mot_de_passe) {
  try {
    const superviseur = await Superviseur.findOne({ 
      where: { email },
      raw: false
    });
    
    if (!superviseur) {
      return null;
    }

    // Vérifier le mot de passe en comparant directement
    const valid = (mot_de_passe === superviseur.mot_de_passe);
    
    if (!valid) {
      return null;
    }

    return superviseur;
  } catch (error) {
    console.error('Erreur d\'authentification superviseur:', error);
    throw error;
  }
};

// Fonction pour vérifier l'unicité de l'email
Superviseur.verifierEmailUnique = async function(email) {
  const superviseur = await Superviseur.findOne({ where: { email } });
  return !superviseur;
};

module.exports = Superviseur;