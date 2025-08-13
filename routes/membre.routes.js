const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifit} = require('../middlewares/authentification');

router.post('/', userController.createUser);
router.post('/login', userController.login);
router.get('/login', userController.loginget);
router.post('/logout', userController.logout);
router.get('/logout', userController.logoute);
router.get('/', verifit(' '), userController.getAllUsers);
router.get('/:id',verifit(' '), userController.getUserById);
router.put('/:id', verifit('Admin'), userController.updateUser);
router.delete('/:id',verifit('Admin'), userController.deleteUser);

module.exports = router;
