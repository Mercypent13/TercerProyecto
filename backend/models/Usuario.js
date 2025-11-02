const mongoose = require('mongoose')

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true, 
    },

    correo_electronico: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Por favor, introduce un correo electrónico válido'],
    },

    contrasena: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false,
    },

    rol: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario',
    },

    fecha_creacion: {
        type: Date,
        default: Date.now,
    },
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
