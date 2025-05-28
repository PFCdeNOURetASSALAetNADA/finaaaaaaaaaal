const Reclamation = require('../models/reclamation');
const DateReclamation = require('../models/date');

// إنشاء شكوى جديدة
exports.create = async (req, res) => {
    try {
        // Get abonne_id from the authenticated user
        const abonne_id = req.params.id;

        // Create the reclamation with the abonne_id
        const reclamation = await Reclamation.create({
            ...req.body,
            abonne_id,
            date_creation: new Date(),
            date_modification: new Date()
        });
        
        // Create the date record
        const dateRecord = await DateReclamation.create({
            reclamation_id: reclamation.id,
            abonne_id,
            date_creation: new Date(),
            date_modification: new Date()
        });

        // Return the reclamation with date information
        const response = {
            reclamation: reclamation,
            dates: dateRecord
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Error creating reclamation:', error);
        res.status(400).json({ message: error.message });
    }
};

// الحصول على جميع الشكاوى
exports.getAll = async (req, res) => {
    try {
        const reclamations = await Reclamation.findAll();
        res.status(200).json(reclamations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// الحصول على شكوى واحدة بواسطة المعرف
exports.getOne = async (req, res) => {
    try {
        const reclamation = await Reclamation.findAll({
            where: { 
                abonne_id: req.params.id
            },
            include: [{
                model: DateReclamation,
                as: 'DateReclamation',
                attributes: ['date_creation', 'date_modification']
            }]
        });

        if (!reclamation) {
            return res.status(404).json({ message: 'الشكوى غير موجودة أو غير مصرح لك بالوصول إليها' });
        }

        res.status(200).json(reclamation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// تحديث شكوى
exports.update = async (req, res) => {
    try {
        const reclamation = await Reclamation.findByPk(req.params.id);
        if (!reclamation) {
            return res.status(404).json({ message: 'الشكوى غير موجودة' });
        }
        
        // تحديث الشكوى
        await reclamation.update(req.body);
        
        // تحديث تاريخ التعديل في جدول التواريخ
        await DateReclamation.update(
            { date_modification: new Date() },
            { where: { reclamation_id: req.params.id } }
        );

        res.status(200).json(reclamation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// حذف شكوى
exports.delete = async (req, res) => {
    try {
        const reclamation = await Reclamation.findByPk(req.params.id);
        if (!reclamation) {
            return res.status(404).json({ message: 'الشكوى غير موجودة' });
        }
        await reclamation.destroy();
        res.status(200).json({ message: 'تم حذف الشكوى بنجاح' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// الحصول على شكاوى مشترك معين
exports.getByAbonne = async (req, res) => {
    try {
        const reclamations = await Reclamation.findAll({
            where: { abonne_id: req.params.abonneId },
            include: [{
                model: DateReclamation,
                as: 'DateReclamation',
                attributes: ['date_creation', 'date_modification']
            }]
        });
        res.status(200).json(reclamations);
    } catch (error) {
        console.error('Error getting reclamations:', error);
        res.status(500).json({ message: error.message });
    }
}; 