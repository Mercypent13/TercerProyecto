const Categoria = require('../models/Categorias.js');

//1. Crea una nueva categoría.

const createCategoria = async (req, res) => {
    try {
        const nuevaCategoria = new Categoria(req.body);
        const categoriaGuardada = await nuevaCategoria.save();

        res.status(201).json({ 
            message: 'Categoría creada con éxito.', 
            data: categoriaGuardada 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Error: Ya existe una categoría con este nombre.',
                error: error.message
            });
        }
        res.status(400).json({ 
            message: 'Error al crear la categoría. Asegúrate de proporcionar nombre y descripción.', 
            error: error.message 
        });
    }
};

//2. Obtiene una categoría usando el nombre como identificador.

const getCategoriaByNombre = async (req, res) => {
    const { nombre } = req.params;

    try {
        const categoria = await Categoria.findOne({ nombre: nombre }); 

        if (!categoria) {
            return res.status(404).json({ message: `Categoría "${nombre}" no encontrada.` });
        }
        res.status(200).json(categoria);
    } catch (err) {
        res.status(500).json({ message: 'Error al buscar la categoría.', error: err.message });
    }
};


//3. Actualiza la descripción de una categoría usando el nombre.

const updateCategoriaDescription = async (req, res) => {
    const { nombre } = req.params; 
    const { descripcion } = req.body; 

    if (!descripcion) {
        return res.status(400).json({ message: 'Se requiere el campo "descripcion" para actualizar.' });
    }

    try {
        const categoriaActualizada = await Categoria.findOneAndUpdate(
            { nombre: nombre }, // Búsqueda por el nombre único
            { $set: { descripcion: descripcion } },
            { new: true, runValidators: true }
        );

        if (!categoriaActualizada) {
            return res.status(404).json({ message: `Categoría "${nombre}" no encontrada para actualizar.` });
        }
        
        res.status(200).json({
            message: `Descripción de categoría "${nombre}" actualizada con éxito.`,
            data: categoriaActualizada
        });

    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la categoría.', error: err.message });
    }
};

//4. Elimina una categoría usando el nombre como identificador.

const deleteCategoria = async (req, res) => {
    const { nombre } = req.params; 

    try {
        const resultado = await Categoria.findOneAndDelete({ nombre: nombre }); 
        
        if (!resultado) {
            return res.status(404).json({ message: `Categoría "${nombre}" no encontrada para eliminar.` });
        }
        
        res.status(200).json({ 
            message: `Categoría "${nombre}" eliminada con éxito.`,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la categoría.', error: err.message });
    }
};

// 5. Función para obtener todas las categorías.
const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find().sort({ nombre: 1 });
        res.status(200).json({
            message: 'Lista de categorías obtenida.',
            data: categorias
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error interno del servidor al obtener categorías.', 
            error: error.message 
        });
    }
};

module.exports = {
    getCategorias,
    deleteCategoria,
    updateCategoriaDescription,
    getCategoriaByNombre,
    createCategoria,
};