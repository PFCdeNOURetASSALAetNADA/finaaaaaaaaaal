const Operateur = require('../models/operateur');
const Agent = require('../models/agent');
const Reclamation = require('../models/reclamation');
const Abonne = require('../models/abonne');
const jwt = require('jsonwebtoken');

// إنشاء موظف جديد
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;

    // Vérification de l'unicité de l'email
    const emailUnique = await Operateur.verifierEmailUnique(email);
    if (!emailUnique) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Création de l'opérateur avec le mot de passe en clair
    const operateur = await Operateur.create({ 
      nom, 
      prenom, 
      email, 
      mot_de_passe // Stocker le mot de passe en clair
    });

    res.status(201).json({ 
      message: 'Opérateur créé avec succès.',
      operateur: { id: operateur.id, nom: operateur.nom, prenom: operateur.prenom, email: operateur.email }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(400).json({ error: error.message });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    console.log('Demande de connexion opérateur:', req.body);
    const { email, mot_de_passe } = req.body;
    
    if (!email || !mot_de_passe) {
      console.log('Données incomplètes');
      return res.status(400).json({ error: 'Veuillez saisir toutes les informations requises' });
    }

    console.log('Recherche de l\'opérateur avec l\'email:', email);
    const operateur = await Operateur.findOne({ 
      where: { email },
      raw: false
    });
    
    if (!operateur) {
      console.log('Opérateur non trouvé avec l\'email:', email);
      return res.status(401).json({ error: 'Opérateur non trouvé' });
    }

    console.log('Opérateur trouvé:', operateur.id);
    console.log('Vérification du mot de passe');
    
    // Vérifier le mot de passe
    const valid = (mot_de_passe === operateur.mot_de_passe);
    
    if (!valid) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    console.log('Mot de passe correct');
    
    const operateurData = operateur.toJSON();
    delete operateurData.mot_de_passe;

    const token = jwt.sign(
      { 
        id: operateur.id, 
        role: 'operateur', 
        email: operateur.email,
        nom: operateur.nom,
        prenom: operateur.prenom
      },
      process.env.JWT_SECRET || 'votre_secret_key',
      { expiresIn: '24h' }
    );

    console.log('Token créé avec succès');
    res.json({ 
      message: 'Connexion réussie', 
      operateur: operateurData,
      token 
    });
  } catch (error) {
    console.error('Erreur lors de la connexion opérateur:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la connexion' });
  }
};

// جلب جميع الموظفين
exports.getAll = async (req, res) => {
  try {
    const operateurs = await Operateur.findAll({}); // Aucune exclusion spécifique des champs crypto/reset
    res.json(operateurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب موظف واحد حسب id
exports.getOne = async (req, res) => {
  try {
    const operateur = await Operateur.findByPk(req.params.id, {}); // Aucune exclusion spécifique des champs crypto/reset
    if (!operateur) {
      return res.status(404).json({ error: 'Opérateur non trouvé' });
    }
    res.json(operateur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// إضافة وكيل جديد
exports.createAgent = async (req, res) => {
  try {
    const { nom, prenom, telephone, specialite, region } = req.body;
    const agent = await Agent.create({ 
      nom, 
      prenom, 
      telephone, 
      specialite, 
      region,
      disponible: true 
    });
    res.status(201).json({ message: 'Agent créé avec succès', agent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// جلب جميع الوكلاء
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll({
      attributes: ['id', 'nom', 'prenom', 'telephone', 'visibilite', 'charge_actuelle']
    });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب وكيل محدد
exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id, {
      attributes: ['id', 'nom', 'prenom', 'telephone', 'visibilite', 'charge_actuelle']
    });
    if (!agent) {
      return res.status(404).json({ error: 'Agent non trouvé' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تحديث معلومات الوكيل
exports.updateAgent = async (req, res) => {
  try {
    const { nom, prenom, telephone, specialite, region, disponible } = req.body;
    const agent = await Agent.findByPk(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent non trouvé' });
    }
    await agent.update({ 
      nom, 
      prenom, 
      telephone, 
      specialite, 
      region,
      disponible 
    });
    res.json({ message: 'Agent mis à jour avec succès', agent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// حذف وكيل
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent non trouvé' });
    }
    await agent.destroy();
    res.json({ message: 'Agent supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// البحث عن وكلاء حسب المنطقة
exports.searchAgentsByVisibilite = async (req, res) => {
  try {
    const { visibilite } = req.query;
    const agents = await Agent.findAll({
      where: { visibilite },
      attributes: ['id', 'nom', 'prenom', 'telephone', 'visibilite', 'charge_actuelle']
    });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب الشكاوى المرفقة للمشغل
exports.getMesReclamations = async (req, res) => {
  try {
    console.log('Attempting to fetch reclamations for operator');
    console.log('req.user:', req.user);
    const operateurId = req.user.id; // يتم الحصول على معرف المشغل من التوكن
    console.log('Operateur ID from token:', operateurId);

    if (!operateurId) {
        console.log('Operateur ID not found in token');
        return res.status(401).json({ error: 'Operateur ID not found in token' });
    }

    const reclamations = await Reclamation.findAll({
      where: { operateur_id: operateurId }, // تبحث عن الشكاوى التي معرف المشغل فيها يطابق معرف المشغل من التوكن
      include: [
        {
          model: Abonne,
          attributes: ['id', 'nom', 'prenom', 'email', 'reference']
        }
      ],
      order: [
        ['date_creation', 'DESC'] // ترتيب حسب تاريخ الإنشاء تنازلياً
      ]
    });

    console.log('Number of reclamations found:', reclamations.length);
    res.json(reclamations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réclamations:', error);
    res.status(500).json({ error: error.message });
  }
};

// جلب شكوى محددة للمشغل
exports.getMaReclamation = async (req, res) => {
  try {
    const operateurId = req.user.id;
    const reclamationId = req.params.id;

    const reclamation = await Reclamation.findOne({
      where: { 
        id: reclamationId,
        operateur_id: operateurId 
      },
      include: [
        {
          model: Abonne,
          attributes: ['id', 'nom', 'prenom', 'email', 'reference']
        }
      ]
    });

    if (!reclamation) {
      return res.status(404).json({ error: 'Réclamation non trouvée ou non assignée à cet opérateur' });
    }

    res.json(reclamation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réclamation:', error);
    res.status(500).json({ error: error.message });
  }
};