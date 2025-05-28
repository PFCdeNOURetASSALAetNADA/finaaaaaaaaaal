const express = require('express');
const router = express.Router();
const operateurController = require('../controllers/operateurController');
const authMiddleware = require('../middleware/authMiddleware');

// مسارات المشغل الأساسية
router.post('/register', operateurController.register);
router.post('/login', operateurController.login);
router.get('/', authMiddleware, operateurController.getAll);

// مسارات الشكاوى المرفقة للمشغل (يجب أن تكون قبل مسار /:id)
router.get('/reclamations', (req, res, next) => { console.log('Reached /api/operateurs/reclamations route'); next(); }, authMiddleware, operateurController.getMesReclamations);
router.get('/reclamations/:id', authMiddleware, operateurController.getMaReclamation);

// مسارات إدارة الـ Agent
router.get('/agents', (req, res, next) => { console.log('Reached /api/operateurs/agents route'); next(); }, authMiddleware, operateurController.getAllAgents);
router.get('/agents/:id', authMiddleware, operateurController.getAgent);
router.get('/agents/search', authMiddleware, operateurController.searchAgentsByVisibilite);

router.get('/:id', authMiddleware, operateurController.getOne);

module.exports = router;