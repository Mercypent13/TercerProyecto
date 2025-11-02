const mongoose = require('mongoose')

const ObraSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    descripcion: {
        type: String,
        required:true,
        maxlength: 500,
    },
    url_imagen: {
        type: String,
        required: true,
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categorias: [{
        type: String,
        enum: ["Retratos", "Digital", "Personas", "Paisajes", "Animales", "Construcciones", "Esculturas", "Objetos", "Arte", "Vehículos", "Abstracto", "Pinturas", "Todos"],
        required: true
    }],
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        },
        score: {
            type: Number,
            min: 0,
            max: 5,
            required: true
        }
    }],
    averageRating: { 
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        set: (v) => Math.round(v * 10) / 10 
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    fecha_actualizacion: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' }
});

const Obra = mongoose.model('Obra', ObraSchema);

module.exports = Obra;