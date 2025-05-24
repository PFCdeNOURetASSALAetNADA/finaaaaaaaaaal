const express = require('express');
const router = express.Router();
const abonneController = require('../controllers/abonneController');
const authMiddleware = require('../middleware/authMiddleware');

// تسجيل ذاتي للمشتركين
router.post('/register', abonneController.register);

// تأكيد البريد الإلكتروني
router.post('/verify-email', abonneController.verifyEmail);

// إعادة إرسال رمز التحقق
router.post('/resend-verification', abonneController.resendVerificationCode);

// تسجيل الدخول
router.post('/login', abonneController.login);

// جلب جميع المشتركين (للمشرفين فقط)
router.get('/', authMiddleware, abonneController.getAll);

// جلب مشترك واحد حسب id
router.get('/:id', authMiddleware, abonneController.getOne);

module.exports = router;