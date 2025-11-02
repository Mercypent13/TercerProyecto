const Obra = require('../models/Obras.js');
const Usuario = require('../models/Usuario'); 


const populateOptions = [
    {
        path: 'autor',
        select: 'nombre correo_electronico rol' 
    }
];

const validateCategories = (req, res, next) => {
    const { categorias } = req.body;
    
    if (categorias && Array.isArray(categorias)) {
        if (categorias.length !== 3) {
            return res.status(400).json({ 
                message: 'El array de "categorias" debe contener exactamente 3 elementos.' 
            });
        }
    }
    next();
};


//1. Crea una nueva obra.

const createObra = [validateCategories, async (req, res) => {
    try {
        const rutaImagen = req.file ? `/images/${req.file.filename}` : null;

        if (!rutaImagen) {
             return res.status(400).json({ message: 'El archivo de imagen es obligatorio.' });
        }
        const autorExiste = await Usuario.findById(req.body.autor);
        if (!autorExiste) {
            return res.status(404).json({ message: 'Autor especificado no encontrado.' });
        }
        
        const nuevaObra = new Obra({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            autor: req.body.autor,
            categorias: req.body.categorias,
            url_imagen: rutaImagen,
        });
        
        const obraGuardada = await nuevaObra.save();

        await obraGuardada.populate(populateOptions); 
        res.status(201).json({
            message: 'Obra creada con éxito.',
            data: obraGuardada
        });

    } catch (err) {
        res.status(400).json({ 
            message: 'Error al crear la obra. Revise los campos obligatorios y el formato.', 
            error: err.message 
        });
    }
}];


//2. Obtiene una obra por su ID (GET /:id).

const getObraById = async (req, res) => {
    try {
        const obra = await Obra.findById(req.params.id)
            .populate(populateOptions);

        if (!obra) {
            return res.status(404).json({ message: 'Obra no encontrada.' });
        }
        res.status(200).json(obra);
    } catch (err) {
        res.status(500).json({ message: 'Error al buscar la obra', error: err.message });
    }
};


//3. Devuelve todas las obras existentes (GET).

const getObras = async (req, res) => {
    try {
        const obras = await Obra.find()
            .populate(populateOptions)
            .sort({ fecha_creacion: -1 });
        
        res.status(200).json({
            message: 'Lista de obras obtenida.',
            data: obras
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las obras', error: err.message });
    }
};


// 4.Modifica descripción, título y categorías.

const updateObra = [validateCategories, async (req, res) => {
    const updates = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        categorias: req.body.categorias,
    };

    try {
        const obraActualizada = await Obra.findByIdAndUpdate(
            req.params.id, 
            { 
                $set: updates, 
                fecha_actualizacion: Date.now() 
            }, 
            { new: true, runValidators: true }
            
        ).populate(populateOptions);

        if (!obraActualizada) {
            return res.status(404).json({ message: 'Obra no encontrada para actualizar.' });
        }
        res.status(200).json({
            message: 'Obra actualizada con éxito.',
            data: obraActualizada
        });
    } catch (err) {
        res.status(400).json({ message: 'Error al actualizar la obra', error: err.message });
    }
}];


//5. Elimina una obra por ID.

const deleteObra = async (req, res) => {
    try {
        // 1. Eliminar la obra
        const resultado = await Obra.findByIdAndDelete(req.params.id);
        
        if (!resultado) {
            return res.status(404).json({ message: 'Obra no encontrada para eliminar.' });
        }
        res.status(200).json({ 
            message: 'Obra eliminada con éxito.' 
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la obra', error: err.message });
    }
};

const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const totalScore = ratings.reduce((acc, item) => acc + item.score, 0);
    return totalScore / ratings.length;
};

const rateArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const { score } = req.body;
        const userId = req.user.id;
        if (score === undefined || score < 0 || score > 5) {
            return res.status(400).json({ status: 'fail', message: 'La puntuación debe ser un número entre 0 y 5.' });
        }

        const obra = await Obra.findById(id);

        if (!obra) {
            return res.status(404).json({ status: 'fail', message: 'Obra no encontrada.' });
        }
        const existingRatingIndex = obra.ratings.findIndex(r => r.user.toString() === userId);

        if (existingRatingIndex >= 0) {
            obra.ratings[existingRatingIndex].score = score;
        } else {
            obra.ratings.push({ user: userId, score });
        }
        
        obra.averageRating = calculateAverageRating(obra.ratings);
        await obra.save();

        res.status(200).json({ 
            status: 'success', 
            data: { 
                obra: obra,
                message: 'Puntuación guardada con éxito.'
            } 
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getTopArtworks = async (req, res) => {
    try {
        const topObras = await Obra.find({})
            .sort({ averageRating: -1 })
            .limit(3)
            .select('titulo url_imagen averageRating autor')
            .populate('autor', 'nombre');

        res.status(200).json({
            status: 'success',
            results: topObras.length,
            data: {
                obras: topObras
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    createObra,
    getObras,
    getObraById,
    updateObra,
    deleteObra,
    rateArtwork,
    getTopArtworks
};