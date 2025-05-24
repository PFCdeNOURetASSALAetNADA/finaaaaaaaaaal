const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const administrateurController = require('../controllers/administrateurController');

console.log('--- Loading administrateurRoutes.js ---');

// --- المسارات الأساسية للمدير ---
// إنشاء مدير جديد
router.post('/register', administrateurController.register);

// تسجيل الدخول
router.post('/login', administrateurController.login);

// جلب جميع المدراء (يتطلب صلاحيات المدير)
router.get('/', authMiddleware, administrateurController.getAll);

// --- مسارات المشغلين ---
// جلب جميع المشغلين (يتطلب صلاحيات المدير)
router.get('/operateurs', authMiddleware, administrateurController.getAllOperateurs);

// إنشاء موظف جديد (يتطلب صلاحيات المدير)
router.post('/operateurs', authMiddleware, administrateurController.createOperateur);

// جلب مشغل محدد (يتطلب صلاحيات المدير)
router.get('/operateurs/:id', authMiddleware, administrateurController.getOperateur);

// --- مسارات المشرفين ---
// جلب جميع المشرفين (يتطلب صلاحيات المدير)
router.get('/superviseurs', authMiddleware, administrateurController.getAllSuperviseurs);

// إنشاء مشرف جديد (يتطلب صلاحيات المدير)
router.post('/superviseurs', authMiddleware, administrateurController.createSuperviseur);

// جلب مشرف محدد (يتطلب صلاحيات المدير)
router.get('/superviseurs/:id', authMiddleware, administrateurController.getSuperviseur);

// --- مسارات الوكلاء ---
// إنشاء وكيل جديد (من طرف المدير) (يتطلب صلاحيات المدير)
router.post('/agents', authMiddleware, administrateurController.createAgent);

// جلب مدير واحد حسب id (يتطلب صلاحيات المدير)
router.get('/:id', authMiddleware, administrateurController.getOne);

// --- مسارات إدارة الشكاوى (للمدير) ---
router.get('/reclamations', authMiddleware, administrateurController.getAllReclamations);
router.get('/reclamations/:id', authMiddleware, administrateurController.getReclamation);
router.put('/reclamations/:id', authMiddleware, administrateurController.updateReclamation);

module.exports = router;