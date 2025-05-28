const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/reclamationController');

// Créer une nouvelle réclamation
router.post('/:id', reclamationController.create);

// Récupérer toutes les réclamations
router.get('/', reclamationController.getAll);

// Récupérer une réclamation par son id
router.get('/:id', reclamationController.getOne);

// Modifier une réclamation
router.put('/:id', reclamationController.update);

// حذف شكوى
router.delete('/:id', reclamationController.delete);

// Récupérer les réclamations d'un abonné par son abonne_id
router.get('/abonne/:abonneId', reclamationController.getByAbonne);

module.exports = router;