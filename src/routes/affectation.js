const express = require('express');
const router = express.Router();
const affectationController = require('../controllers/affectationController');
const authMiddleware = require('../middleware/authMiddleware');

// Créer une nouvelle affectation
router.post('/', authMiddleware, affectationController.create);

// جلب جميع التعيينات
router.get('/', authMiddleware, affectationController.getAll);

// جلب تعيين واحد حسب id
router.get('/:id', authMiddleware, affectationController.getOne);

// حذف تعيين
router.delete('/:id', authMiddleware, affectationController.delete);

module.exports = router;