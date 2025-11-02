const express = require('express');
const { 
    createCategoria, 
    getCategorias, 
    getCategoriaByNombre, 
    updateCategoriaDescription, 
    deleteCategoria 
} = require('../controllers/categoriasController'); 

const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// 1. Obtener todas las categorías (útil para formularios de creación de obras)
router.get('/', getCategorias); 

// 2. Obtener una categoría por su nombre (GET /api/categorias/Retratos)
router.get('/:nombre', getCategoriaByNombre); 

// 3. Crear una nueva categoría (POST)
router.post('/', protect, restrictTo('admin'), createCategoria);

// 4. Modificar la descripción (PUT /api/categorias/Retratos)
router.put('/:nombre', protect, restrictTo('admin'), updateCategoriaDescription);

// 5. Eliminar una categoría (DELETE /api/categorias/Retratos)
router.delete('/:nombre', protect, restrictTo('admin'), deleteCategoria);


module.exports = router;