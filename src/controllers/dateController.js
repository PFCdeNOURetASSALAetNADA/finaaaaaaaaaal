const DateReclamation = require('../models/date');

// إنشاء سجل تاريخ جديد
exports.create = async (req, res) => {
  try {
    const { reclamation_id, abonne_id, date_creation, date_modification } = req.body;
    const dateRec = await DateReclamation.create({
      reclamation_id,
      abonne_id,
      date_creation,
      date_modification
    });
    res.status(201).json({ message: 'Date enregistrée avec succès', dateRec });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// جلب كل السجلات
exports.getAll = async (req, res) => {
  try {
    const dates = await DateReclamation.findAll();
    res.json(dates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب سجل واحد حسب id
exports.getOne = async (req, res) => {
  try {
    const dateRec = await DateReclamation.findByPk(req.params.id);
    if (!dateRec) {
      return res.status(404).json({ error: 'Date non trouvée' });
    }
    res.json(dateRec);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تعديل سجل تاريخ
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await DateReclamation.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ error: 'Date non trouvée' });
    }
    const updatedDate = await DateReclamation.findByPk(id);
    res.json({ message: 'Date modifiée', date: updatedDate });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// حذف سجل تاريخ
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await DateReclamation.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Date non trouvée' });
    }
    res.json({ message: 'Date supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};