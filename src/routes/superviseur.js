const express = require('express');
const router = express.Router();
const superviseurController = require('../controllers/superviseurController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour créer un nouveau superviseur
router.post('/register', superviseurController.register);

// Route pour la connexion
router.post('/login', superviseurController.login);

// Récupérer tous les superviseurs
router.get('/', authMiddleware, superviseurController.getAll);

// Récupérer un superviseur par son id
router.get('/:id', authMiddleware, superviseurController.getOne);

module.exports = router;