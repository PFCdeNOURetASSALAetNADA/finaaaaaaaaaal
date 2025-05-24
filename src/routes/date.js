const express = require('express');
const router = express.Router();
const dateController = require('../controllers/dateController');

// Créer un nouvel enregistrement de date
router.post('/', dateController.create);

// Récupérer tous les enregistrements
router.get('/', dateController.getAll);

// Récupérer un enregistrement par son id
router.get('/:id', dateController.getOne);

// Modifier un enregistrement
router.put('/:id', dateController.update);

// Supprimer un enregistrement
router.delete('/:id', dateController.delete);

module.exports = router;