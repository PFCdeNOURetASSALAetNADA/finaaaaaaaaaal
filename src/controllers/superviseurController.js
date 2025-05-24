const Superviseur = require('../models/superviseur');
const Reclamation = require('../models/reclamation');
const Abonne = require('../models/abonne');
const jwt = require('jsonwebtoken');

// إنشاء مشرف جديد
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;

    // Vérification de l'unicité de l'email
    const emailUnique = await Superviseur.verifierEmailUnique(email);
    if (!emailUnique) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const superviseur = await Superviseur.create({ 
      nom, 
      prenom, 
      email, 
      mot_de_passe // Stocker le mot de passe en clair
    });

    res.status(201).json({ 
      message: 'Superviseur créé avec succès.',
      superviseur: { id: superviseur.id, nom: superviseur.nom, prenom: superviseur.prenom, email: superviseur.email }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(400).json({ error: error.message });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ error: 'Veuillez fournir l\'email et le mot de passe.' });
    }

    const superviseur = await Superviseur.authentifier(email, mot_de_passe);

    if (!superviseur) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const superviseurData = superviseur.toJSON();
    delete superviseurData.mot_de_passe;

    const token = jwt.sign(
      { 
        id: superviseur.id, 
        role: 'superviseur', 
        email: superviseur.email,
        nom: superviseur.nom,
        prenom: superviseur.prenom 
      },
      process.env.JWT_SECRET || 'votre_secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Connexion réussie', token, superviseur: superviseurData });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Échec de la connexion.' });
  }
};

// جلب جميع المشرفين
exports.getAll = async (req, res) => {
  try {
    const superviseurs = await Superviseur.findAll({});
    res.status(200).json(superviseurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des superviseurs:', error);
    res.status(500).json({ error: 'Échec de la récupération des superviseurs.' });
  }
};

// جلب مشرف واحد حسب id
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const superviseur = await Superviseur.findByPk(id, {}); // Aucune exclusion spécifique des champs crypto/reset

    if (!superviseur) {
      return res.status(404).json({ error: 'Superviseur non trouvé.' });
    }

    res.status(200).json(superviseur);
  } catch (error) {
    console.error('Erreur lors de la récupération du superviseur:', error);
    res.status(500).json({ error: 'Échec de la récupération du superviseur.' });
  }
};

// جلب الشكاوى حسب منطقة المشرف
exports.getReclamationsByRegion = async (req, res) => {
  try {
    const superviseurId = req.user.id; // يتم الحصول على معرف المشرف من التوكن

    // جلب معلومات المشرف للحصول على المنطقة
    const superviseur = await Superviseur.findByPk(superviseurId);

    if (!superviseur) {
      return res.status(404).json({ error: 'Superviseur non trouvé.' });
    }

    const superviseurRegion = superviseur.region;

    // جلب الشكاوى التي تخص المشتركين في منطقة المشرف
    const reclamations = await Reclamation.findAll({
      include: [
        {
          model: Abonne,
          where: { region: superviseurRegion }, // تصفية حسب منطقة المشترك
          attributes: ['id', 'nom', 'prenom', 'email', 'reference', 'region']
        },
        {
          model: Operateur,
          attributes: ['id', 'nom', 'prenom']
        }
      ],
      order: [
        ['date_creation', 'DESC'] // ترتيب حسب تاريخ الإنشاء تنازلياً
      ]
    });

    res.status(200).json(reclamations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réclamations par région:', error);
    res.status(500).json({ error: 'Échec جلب الشكاوى.' });
  }
};