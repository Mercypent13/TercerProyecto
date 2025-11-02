const express = require('express');
const { 
    registerUser, 
    loginUser, 
    logoutUser,
    getUsers,
    getUserById,
    updatePassword,
    deleteUser
} = require('../controllers/usuarioController');

const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);


// 1. Obtener todos los usuarios
router.get('/', protect, restrictTo('admin'), getUsers);

// 2. Obtener mi información o la de un usuario por ID
router.get('/:id', protect, getUserById); 

// 3. Modificar Contraseña
router.patch('/:id/password', protect, updatePassword);

// 4. Eliminar Usuario
router.delete('/:id', protect, deleteUser);


module.exports = router;