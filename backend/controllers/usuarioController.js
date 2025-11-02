const Usuario = require('../models/Usuario'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

//1. Crea un nuevo usuario (Registro).

const registerUser = async (req, res) => {
    const { nombre, correo_electronico, contrasena, rol } = req.body;

    try {
        let targetRole = rol;
        if (targetRole === 'admin') {
            const adminCount = await Usuario.countDocuments({ rol: 'admin' });
            if (adminCount > 0) {
                targetRole = 'usuario';
            }
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        const nuevoUsuario = new Usuario({
            nombre,
            correo_electronico,
            contrasena: hashedPassword,
            rol: targetRole || 'usuario',
        });

        const usuarioGuardado = await nuevoUsuario.save();
        
        const token = signToken(usuarioGuardado._id);

        const userResponse = usuarioGuardado.toObject();
        delete userResponse.contrasena; 

        res.status(201).json({
            message: `Registro exitoso. Rol asignado: ${userResponse.rol}`,
            token,
            data: userResponse
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }
        res.status(400).json({ message: 'Error en el registro', error: err.message });
    }
};


//2. Iniciar Sesión.

const loginUser = async (req, res) => {
    const { correo_electronico, contrasena } = req.body;
    if (!correo_electronico || !contrasena) {
        return res.status(400).json({ message: 'Por favor, proporcione correo y contraseña.' });
    }

    try {
        const usuario = await Usuario.findOne({ correo_electronico }).select('+contrasena');

        if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const token = signToken(usuario._id);

        const userResponse = usuario.toObject();
        delete userResponse.contrasena;
        
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            data: userResponse
        });
    } catch (err) {
        res.status(500).json({ message: 'Error en el inicio de sesión', error: err.message });
    }
};

//3. Cerrar Sesión (Logout).

const logoutUser = (req, res) => {
    res.status(200).json({ 
        message: 'Sesión cerrada. El token JWT debe ser eliminado en el lado del cliente.' 
    });
};

//4. Obtener todos los usuarios.

const getUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.find().sort({ rol: -1, nombre: 1 });
        res.status(200).json({
            message: 'Lista de usuarios obtenida.',
            count: usuarios.length,
            data: usuarios
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
    }
};

//5. Obtener un solo usuario por ID.

const getUserById = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({ message: 'Error al buscar usuario', error: err.message });
    }
};


//El usuario puede cambiar su propia contraseña. El admin puede cambiar cualquier 
const updatePassword = async (req, res) => {
    const { new_contrasena, current_contrasena } = req.body;
    const targetUserId = req.params.id;
    const authenticatedUser = req.user;

    if (!new_contrasena) {
        return res.status(400).json({ message: 'Se requiere la nueva contraseña.' });
    }

    try {
        const targetUser = await Usuario.findById(targetUserId).select('+contrasena');
        if (!targetUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        if (authenticatedUser.rol !== 'admin' && authenticatedUser._id.toString() !== targetUserId) {
            return res.status(403).json({ message: 'No tiene permiso para modificar esta cuenta.' });
        }
        if (authenticatedUser.rol !== 'admin') {
            if (!current_contrasena || !(await bcrypt.compare(current_contrasena, targetUser.contrasena))) {
                return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
            }
        }
        const salt = await bcrypt.genSalt(10);
        targetUser.contrasena = await bcrypt.hash(new_contrasena, salt);
        await targetUser.save();

        res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la contraseña', error: err.message });
    }
};

//7. Eliminar usuario.

const deleteUser = async (req, res) => {
    const targetUserId = req.params.id;
    const authenticatedUser = req.user;

    try {
        const targetUser = await Usuario.findById(targetUserId);
        if (targetUser && targetUser.rol === 'admin') {
            return res.status(403).json({ message: 'El usuario Admin no puede ser eliminado.' });
        }
        if (authenticatedUser.rol !== 'admin' && authenticatedUser._id.toString() !== targetUserId) {
            return res.status(403).json({ message: 'No tiene permiso para eliminar esta cuenta.' });
        }
        const resultado = await Usuario.findByIdAndDelete(targetUserId);

        if (!resultado) {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUsers,
    getUserById,
    updatePassword,
    deleteUser,
};