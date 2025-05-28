const Administrateur = require('../models/administrateur');
const Operateur = require('../models/operateur');
const Superviseur = require('../models/superviseur');
const Abonne = require('../models/abonne');
const Reclamation = require('../models/reclamation');
const Agent = require('../models/agent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// إنشاء مدير جديد
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, permission } = req.body;
    
    // التحقق من عدم وجود البريد الإلكتروني
    const emailUnique = await Administrateur.findOne({ where: { email } });
    if (emailUnique) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // إنشاء المدير
    const admin = await Administrateur.create({ 
      nom, 
      prenom, 
      email, 
      mot_de_passe, // تخزين كلمة المرور كنص عادي
      permission 
    });
    
    res.status(201).json({ 
      message: 'Administrateur créé avec succès.',
      admin: { 
        id: admin.id, 
        nom: admin.nom, 
        prenom: admin.prenom, 
        email: admin.email,
        permission: admin.permission
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
      res.status(400).json({ error: error.message });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
    try {
      const { email, mot_de_passe } = req.body;
      const admin = await Administrateur.authentifier(email, mot_de_passe);
      if (!admin) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const adminData = admin.toJSON();
      delete adminData.mot_de_passe;
  
      const token = jwt.sign(
        { id: admin.id, role: 'admin' },
        process.env.JWT_SECRET || 'votre_secret_key',
      { expiresIn: '24h' }
      );
  
      res.json({ message: 'Connexion réussie', admin: adminData, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// جلب جميع المدراء
exports.getAll = async (req, res) => {
  try {
    const admins = await Administrateur.findAll({
      attributes: { exclude: ['mot_de_passe'] }
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب مدير واحد حسب id
exports.getOne = async (req, res) => {
  try {
    const admin = await Administrateur.findByPk(req.params.id, {
      attributes: { exclude: ['mot_de_passe'] }
    });
    if (!admin) {
      return res.status(404).json({ error: 'Administrateur non trouvé' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// إنشاء موظف جديد
exports.createOperateur = async (req, res) => {
  try {
    // التحقق من أن المستخدم مدير
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { nom, prenom, email, mot_de_passe, niveau } = req.body;

    // التحقق من عدم وجود البريد الإلكتروني
    const emailUnique = await Operateur.verifierEmailUnique(email);
    if (!emailUnique) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // إنشاء المشغل
    const operateur = await Operateur.create({ 
      nom, 
      prenom, 
      email, 
      mot_de_passe,
      niveau
    });

    res.status(201).json({ 
      message: 'Opérateur créé مع succès.',
      operateur: { 
        id: operateur.id, 
        nom: operateur.nom, 
        prenom: operateur.prenom, 
        email: operateur.email,
        niveau: operateur.niveau
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'opérateur:', error);
    res.status(400).json({ error: error.message });
  }
};

// إنشاء مشرف جديد
exports.createSuperviseur = async (req, res) => {
  try {
    // التحقق من أن المستخدم مدير
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const { nom, prenom, email, mot_de_passe } = req.body;

    // التحقق من عدم وجود البريد الإلكتروني
    const emailUnique = await Superviseur.verifierEmailUnique(email);
    if (!emailUnique) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // إنشاء المشرف
    const superviseur = await Superviseur.create({ 
      nom, 
      prenom, 
      email, 
      mot_de_passe,
      charge_actuelle: 0
    });

    res.status(201).json({ 
      message: 'Superviseur créé avec succès.',
      superviseur: { 
        id: superviseur.id, 
        nom: superviseur.nom, 
        prenom: superviseur.prenom, 
        email: superviseur.email,
        charge_actuelle: superviseur.charge_actuelle
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du superviseur:', error);
    res.status(400).json({ error: error.message });
  }
};

// إنشاء مشترك جديد
exports.createAbonne = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, reference } = req.body;
    const abonne = await Abonne.create({ nom, prenom, email, mot_de_passe, reference });
    res.status(201).json({ message: 'Abonné créé avec succès', abonne });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// إنشاء وكيل جديد
exports.createAgent = async (req, res) => {
  try {
    const { nom, prenom, telephone, pisibilite, charge_actuelle } = req.body;
    const agent = await Agent.create({ nom, prenom, telephone, pisibilite, charge_actuelle });
    res.status(201).json({ message: 'Agent créé avec succès', agent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// جلب جميع المشغلين
exports.getAllOperateurs = async (req, res) => {
  console.log('--- getAllOperateurs called ---');
    try {
        const operateurs = await Operateur.findAll({
            attributes: { exclude: ['password'] } // استثناء كلمة المرور من النتائج
        });
        res.status(200).json(operateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// جلب جميع المشرفين
exports.getAllSuperviseurs = async (req, res) => {
  console.log('--- getAllSuperviseurs called ---');
    try {
        const superviseurs = await Superviseur.findAll({
            attributes: { exclude: ['password'] } // استثناء كلمة المرور من النتائج
        });
        res.status(200).json(superviseurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// جلب مشغل محدد
exports.getOperateur = async (req, res) => {
    try {
        const operateur = await Operateur.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!operateur) {
            return res.status(404).json({ message: 'المشغل غير موجود' });
        }
        res.status(200).json(operateur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// جلب مشرف محدد
exports.getSuperviseur = async (req, res) => {
    try {
        const superviseur = await Superviseur.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!superviseur) {
            return res.status(404).json({ message: 'المشرف غير موجود' });
        }
        res.status(200).json(superviseur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// جلب جميع الشكاوى (للمدير)
exports.getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.findAll({
      include: [
        {
          model: Abonne,
          attributes: ['id', 'nom', 'prenom', 'email', 'reference']
        },
        {
          model: Operateur,
          attributes: ['id', 'nom', 'prenom']
        }
      ],
      order: [
        ['date_creation', 'DESC']
      ]
    });
    res.status(200).json(reclamations);
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les réclamations:', error);
    res.status(500).json({ error: error.message });
  }
};

// جلب شكوى محددة (للمدير)
exports.getReclamation = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamation = await Reclamation.findByPk(id, {
      include: [
        {
          model: Abonne,
          attributes: ['id', 'nom', 'prenom', 'email', 'reference']
        },
        {
          model: Operateur,
          attributes: ['id', 'nom', 'prenom']
        }
      ]
    });

    if (!reclamation) {
      return res.status(404).json({ error: 'Réclamation non trouvée.' });
    }

    res.status(200).json(reclamation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réclamation:', error);
    res.status(500).json({ error: 'Échec de la récupération de la réclamation.' });
  }
};

// تحديث شكوى (للمدير - مثال: تعيين مشغل)
exports.updateReclamation = async (req, res) => {
  try {
    const { id } = req.params;
    const { operateur_id, statut, priorite, necessite_agent, adresse_intervention, date_intervention } = req.body;

    const reclamation = await Reclamation.findByPk(id);

    if (!reclamation) {
      return res.status(404).json({ error: 'Réclamation non trouvée.' });
    }

    // تحديث الحقول المسموح بتحديثها من قبل المدير
    await reclamation.update({
      operateur_id: operateur_id !== undefined ? operateur_id : reclamation.operateur_id,
      statut: statut !== undefined ? statut : reclamation.statut,
      priorite: priorite !== undefined ? priorite : reclamation.priorite,
      necessite_agent: necessite_agent !== undefined ? necessite_agent : reclamation.necessite_agent,
      adresse_intervention: adresse_intervention !== undefined ? adresse_intervention : reclamation.adresse_intervention,
      date_intervention: date_intervention !== undefined ? date_intervention : reclamation.date_intervention,
    });

    res.status(200).json({ message: 'Réclamation mise à jour avec succès.', reclamation });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réclamation:', error);
    res.status(500).json({ error: 'Échec de la mise à jour de la réclamation.' });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll({
      attributes: ['id', 'nom', 'prenom', 'telephone', 'visibilite', 'charge_actuelle'],
      order: [['nom', 'ASC']]
    });
    res.status(200).json(agents);
  } catch (error) {
    console.error('Erreur lors de la récupération des agents:', error);
    res.status(500).json({ error: error.message });
  }
};