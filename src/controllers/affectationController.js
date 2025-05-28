const Affectation = require('../models/affectation');

// إنشاء تعيين جديد
exports.create = async (req, res) => {
  try {
    const { agent_id, reclamation_id, date_affectation } = req.body;
    console.log('Received request body:', req.body);
    const affectation = await Affectation.create({
      agent_id,
      reclamation_id,
      date_affectation
    });
    res.status(201).json({ message: 'Affectation créée avec succès', affectation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// جلب جميع التعيينات
exports.getAll = async (req, res) => {
  try {
    const affectations = await Affectation.findAll();
    res.json(affectations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب تعيين واحد حسب id
exports.getOne = async (req, res) => {
  try {
    const affectation = await Affectation.findByPk(req.params.id);
    if (!affectation) {
      return res.status(404).json({ error: 'Affectation non trouvée' });
    }
    res.json(affectation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف تعيين
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Affectation.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Affectation non trouvée' });
    }
    res.json({ message: 'Affectation supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};