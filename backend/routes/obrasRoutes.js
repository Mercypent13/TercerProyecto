const express = require('express');
const { 
    createObra, 
    getObras, 
    getObraById, 
    updateObra, 
    deleteObra,
    getTopArtworks,
    rateArtwork
} = require('../controllers/obrasController'); 

const { protect, restrictTo } = require('../middlewares/authMiddleware');

const uploadMiddleware = require('../middlewares/uploadImages');

const router = express.Router();


// 1. Obtener todas las obras (Normalmente, es público para una galería)
router.get('/', getObras); 

// 6. Obtener Top 3 obras
router.get('/top-3', getTopArtworks);

// 2. Obtener una obra por ID (Público)
router.get('/:id', getObraById); 

// 3. Crear una nueva obra (POST)
router.post('/', protect, restrictTo('admin', 'usuario'), uploadMiddleware, createObra);
// 4. Modificar una obra por ID (PUT)
router.put('/:id', protect, restrictTo('admin', 'usuario'), updateObra);

// 5. Eliminar una obra por ID (DELETE)
router.delete('/:id', protect, restrictTo('admin', 'usuario'), deleteObra);

// 7. Puntuación de Obra
router.post('/:id/rate', protect, rateArtwork);

module.exports = router;