const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('./index');

class Abonne extends Model {}

Abonne.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  mot_de_passe: { type: DataTypes.STRING, allowNull: false },
  reference: { type: DataTypes.STRING, allowNull: false, unique: true },
  code_verification: { type: DataTypes.STRING, allowNull: true },
  date_expiration_code: { type: DataTypes.DATE, allowNull: true },
  email_verifie: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  sequelize,
  modelName: 'Abonne',
  tableName: 'abonnes',
  timestamps: false
});

// Fonction d'authentification spécifique à Abonne
Abonne.authentifier = async function(reference, mot_de_passe) {
  try {
    const abonne = await Abonne.findOne({ 
      where: { reference },
      raw: false
    });
    
    if (!abonne) {
      return null;
    }

    // Vérifier le mot de passe en comparant directement
    const valid = (mot_de_passe === abonne.mot_de_passe);
    
    if (!valid) {
      return null;
    }

    return abonne;
  } catch (error) {
    console.error('Erreur d\'authentification abonné:', error);
    throw error;
  }
};

// Fonction pour vérifier l'unicité de l'email
Abonne.verifierEmailUnique = async function(email) {
  const abonne = await Abonne.findOne({ where: { email } });
  return !abonne;
};

// Fonction pour vérifier l'unicité de la référence
Abonne.verifierReferenceUnique = async function(reference) {
  const abonne = await Abonne.findOne({ where: { reference } });
  return !abonne;
};

// Fonction pour vérifier le code de confirmation
Abonne.verifierCode = async function(email, code) {
  const abonne = await Abonne.findOne({ 
    where: { 
      email,
      code_verification: code,
      date_expiration_code: { [Op.gt]: new Date() }
    }
  });
  
  if (!abonne) {
    return false;
  }

  // Mettre à jour le statut de vérification
  abonne.email_verifie = true;
  abonne.code_verification = null;
  abonne.date_expiration_code = null;
  await abonne.save();
  
  return true;
};

// Fonction pour renvoyer le code de vérification
Abonne.renvoyerCodeVerification = async function(email) {
  const abonne = await Abonne.findOne({ where: { email } });
  if (!abonne) {
    return false;
  }

  // Générer رمز تحقق رقمي جديد أقصر (6 أرقام)
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  abonne.code_verification = verificationCode; 
  abonne.date_expiration_code = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await abonne.save();
  
  return abonne.code_verification;
};

module.exports = Abonne;