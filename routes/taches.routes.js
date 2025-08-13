const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tache.controllers');
const {verifit} = require('../middlewares/authentification');

// 🆕 Créer une tâche
router.post('/ajoute', verifit(" "), taskController.createTask);

// 📄 Obtenir toutes les tâches (avec pagination + filtres)
router.get('/affiches', verifit(" "), taskController.getTasks);

//📄 Obtenir toutes les tâches 
router.post('/affiche', verifit(" "), taskController.getTask);

//super.bla.bla,  100livres1jour  , bastien.pelissier ,,  dalidutilleul

// 🔍 Obtenir une tâche spécifique par ID
router.get('/:id', verifit(" "), taskController.getTaskById);

// ✏️ Modifier une tâche
router.put('/:id', verifit(" "), taskController.updateTask);

// 🗑️ Supprimer une tâche
router.delete('/:id', verifit(" "), taskController.deleteTask);

module.exports = router;
