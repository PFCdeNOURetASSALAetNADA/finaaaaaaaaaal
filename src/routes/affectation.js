const express = require('express');
const router = express.Router();
const affectationController = require('../controllers/affectationController');

// Créer une nouvelle affectation
router.post('/', affectationController.create);

// جلب جميع التعيينات
router.get('/', affectationController.getAll);

// جلب تعيين واحد حسب id
router.get('/:id', affectationController.getOne);

// حذف تعيين
router.delete('/:id', affectationController.delete);

module.exports = router;