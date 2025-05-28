const Abonne = require('../models/abonne');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

// Création d'un nouvel abonné (inscription)
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, reference, region } = req.body;

    // Vérification de l'unicité de l'email
    const emailUnique = await Abonne.verifierEmailUnique(email);
    if (!emailUnique) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Vérification de l'unicité de la référence
    const referenceUnique = await Abonne.verifierReferenceUnique(reference);
    if (!referenceUnique) {
      return res.status(400).json({ error: 'Cette référence est déjà utilisée' });
    }

    // Création de l'abonné مع le mot de passe en clair
    const abonne = await Abonne.create({ 
      nom, 
      prenom, 
      email, 
      mot_de_passe, // Stocker le mot de passe en clair
      reference,
      region
    });

    // Générer رمز تحقق رقمي (6 أرقام)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    abonne.code_verification = verificationCode; // تم تغيير اسم العمود
    abonne.date_expiration_code = new Date(Date.now() + 3600000); // Code valide pour 1 heure
    await abonne.save();

    // Envoi de l'email de vérification
    const emailSent = await emailService.sendVerificationEmail(
      email,
      verificationCode,
      nom,
      prenom
    );

    if (!emailSent) {
      return res.status(500).json({ error: 'Échec de l\'envoi de l\'email de vérification' });
    }

    res.status(201).json({ 
      message: 'Abonné créé avec succès. Veuillez vérifier votre email.',
      abonne: { id: abonne.id, nom: abonne.nom, prenom: abonne.prenom, email: abonne.email, reference: abonne.reference }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(400).json({ error: error.message });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { reference, mot_de_passe } = req.body;
    
    if (!reference || !mot_de_passe) {
      return res.status(400).json({ error: 'Veuillez fournir la référence et le mot de passe.' });
    }

    const abonne = await Abonne.authentifier(reference, mot_de_passe);
    
    if (!abonne) {
      return res.status(401).json({ error: 'Référence ou mot de passe incorrect.' });
    }

    if (!abonne.email_verifie) {
      return res.status(401).json({ error: 'Veuillez vérifier votre email avant de vous connecter.' });
    }

    const abonneData = abonne.toJSON();
    delete abonneData.mot_de_passe;

    const token = jwt.sign(
      { 
        id: abonne.id, 
        role: 'abonne', 
        reference: abonne.reference,
        nom: abonne.nom,
        prenom: abonne.prenom
      },
      process.env.JWT_SECRET || 'votre_secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Connexion réussie', token, abonne: abonneData });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Échec de la connexion.' });
  }
};

// Confirmation de l'email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body; // Lire l'email ici

    // Passer l'email à la méthode verifierCode
    const verified = await Abonne.verifierCode(email, code);
    if (!verified) {
      return res.status(400).json({ error: 'Code de vérification invalide ou expiré' });
    }

    res.json({ message: 'Email confirmé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les abonnés (pour les superviseurs uniquement)
exports.getAll = async (req, res) => {
  try {
    const abonnes = await Abonne.findAll({
      attributes: { exclude: ['code_verification', 'date_expiration_code', 'passwordResetToken', 'passwordResetExpires'] } // Exclure aussi les champs de reset password
    });
    res.json(abonnes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un abonné par son id
exports.getOne = async (req, res) => {
  try {
    const abonne = await Abonne.findByPk(req.params.id, {
      attributes: { exclude: ['passwordResetToken', 'passwordResetExpires'] } // Exclure les champs de reset password
    });
    if (!abonne) {
      return res.status(404).json({ error: 'Abonné non trouvé' });
    }
    res.json(abonne);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Renvoi du code de vérification
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    // Trouver l'abonné non vérifié
    const abonne = await Abonne.findOne({ where: { email, email_verifie: false } });
    if (!abonne) {
      return res.status(404).json({ error: 'Aucun compte trouvé avec cet email non vérifié' });
    }

    // Générer un nouveau code de vérification (peut utiliser Math.random si crypto retiré)
    const verificationCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // Exemple simple sans crypto
    abonne.verificationCode = verificationCode;
    abonne.verificationCodeExpires = Date.now() + 3600000; // Code valide pour 1 heure
    await abonne.save();

    // Envoyer le nouvel email de vérification
    const emailSent = await emailService.sendVerificationEmail(
      email,
      verificationCode,
      abonne.nom,
      abonne.prenom
    );

    if (!emailSent) {
      return res.status(500).json({ error: 'Échec de l\'envoi de l\'email de vérification' });
    }

    res.json({ message: 'Un nouveau code de vérification a été envoyé à votre email' });
  } catch (error) {
    console.error('Erreur lors du renvoi du code de vérification:', error);
    res.status(500).json({ error: error.message });
  }
};

// Vous aurez besoin d'importer Sequelize pour Sequelize.Op.gt si ce n'est pas déjà fait.
// const { Sequelize } = require('sequelize');