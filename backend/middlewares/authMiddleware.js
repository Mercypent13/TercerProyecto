const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario.js');

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ 
            message: 'Acceso denegado: No se encontró token de autenticación.' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await Usuario.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ 
                message: 'El usuario asociado al token ya no existe.' 
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado.' });
        }
        res.status(500).json({ message: 'Error de autenticación.' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.rol)) {
            return res.status(403).json({
                message: 'No tienes permiso para realizar esta acción.'
            });
        }
        next();
    };
};

module.exports = { protect, restrictTo };