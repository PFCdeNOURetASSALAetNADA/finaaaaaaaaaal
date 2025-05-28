const { DataTypes, Model } = require('sequelize');
const sequelize = require('./index');

class Operateur extends Model {}

Operateur.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  mot_de_passe: { type: DataTypes.STRING, allowNull: false }
}, {
  sequelize,
  modelName: 'Operateur',
  tableName: 'operateurs',
  timestamps: false
});

// Fonction d'authentification spécifique à Operateur
Operateur.authentifier = async function(email, mot_de_passe) {
  try {
    console.log('Tentative d\'authentification opérateur pour l\'email:', email);
    
    // Rechercher l'opérateur
    const operateur = await Operateur.findOne({ 
      where: { email },
      raw: false
    });
    
    if (!operateur) {
      console.log('Opérateur non trouvé avec l\'email:', email);
      return null;
    }

    console.log('Opérateur trouvé, vérification du mot de passe');
    
    // Vérifier le mot de passe en comparant directement
    const valid = (mot_de_passe === operateur.mot_de_passe);
    
    if (!valid) {
      console.log('Mot de passe incorrect pour l\'opérateur:', email);
      return null;
    }

    console.log('Mot de passe vérifié avec succès pour l\'opérateur:', email);
    return operateur;
  } catch (error) {
    console.error('Erreur d\'authentification opérateur:', error);
    throw error;
  }
};

// Fonction pour vérifier l'unicité de l'email
Operateur.verifierEmailUnique = async function(email) {
  const operateur = await Operateur.findOne({ where: { email } });
  return !operateur;
};

module.exports = Operateur;