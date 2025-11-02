const mongoose = require('mongoose')

const CategoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
});

const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria;