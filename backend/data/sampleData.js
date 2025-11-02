const generateTitle = (path) => {
    const name = path.split('-')[0].replace(/\d|\./g, '').trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
};

const generateDescription = (title) => {
    const descriptions = [
        `Una poderosa representación de la emoción capturada en el momento.`,
        `Obra vibrante y detallada que fusiona estilos clásico y moderno.`,
        `Estudio de la luz y la sombra, explorando la quietud en el movimiento.`,
        `Fascinante pieza abstracta con un profundo uso del color y la textura.`,
        `Una visión nostálgica del pasado, reinterpretada en el presente.`,
    ];
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    return `${title}: ${descriptions[randomIndex]}`;
};

const generateRandomRatings = () => {
    const raters = ['Alejandro Ortiz', 'Andrea Rivas', 'Samuel Torres'];
    const ratings = [];
    
    const numRatings = Math.floor(Math.random() * (raters.length + 1)); 

    const ratersToUse = raters.slice().sort(() => 0.5 - Math.random()).slice(0, numRatings);
    
    ratersToUse.forEach(rater => {
        const score = Math.floor(Math.random() * 5) + 1;
        ratings.push({
            user_name: rater,
            score: score
        });
    });
    return ratings;
};


const users = [
    {
        nombre: 'Admin Maestro',
        correo_electronico: 'admin@galeria.com',
        contrasena: 'admin123',
        rol: 'admin',
    },
    {
        nombre: 'Alejandro Ortiz',
        correo_electronico: 'alejandro.ortiz@galeria.com',
        contrasena: 'autor123', 
        rol: 'usuario', 
    },
    {
        nombre: 'Andrea Rivas',
        correo_electronico: 'andrea.rivas@galeria.com',
        contrasena: 'autor123', 
        rol: 'usuario',
    },
    {
        nombre: 'Samuel Torres',
        correo_electronico: 'samuel.torres@galeria.com',
        contrasena: 'autor123', 
        rol: 'usuario',
    },
];

const categories = [
    { nombre: 'Retratos', descripcion: 'Representación artística de una o más personas.' },
    { nombre: 'Digital', descripcion: 'Arte creado o modificado usando tecnología y software.' },
    { nombre: 'Personas', descripcion: 'Obras que tienen al ser humano como su foco principal.' },
    { nombre: 'Paisajes', descripcion: 'Representación de entornos naturales, urbanos o marinos.' },
    { nombre: 'Animales', descripcion: 'Arte centrado en la fauna, vida salvaje o doméstica.' },
    { nombre: 'Construcciones', descripcion: 'Obras que muestran arquitectura, estructuras o edificios.' },
    { nombre: 'Esculturas', descripcion: 'Representaciones tridimensionales de figuras u objetos.' },
    { nombre: 'Objetos', descripcion: 'Arte que se enfoca en elementos inanimados o bodegones.' },
    { nombre: 'Arte', descripcion: 'Categoría general para obras de gran valor estético.' },
    { nombre: 'Vehículos', descripcion: 'Representación artística de medios de transporte.' },
    { nombre: 'Abstracto', descripcion: 'Arte no figurativo, que usa formas y colores en lugar de objetos reales.' },
    { nombre: 'Pinturas', descripcion: 'Obras creadas con técnicas tradicionales de pintura (óleo, acrílico, etc.).' },
    { nombre: 'Todos', descripcion: 'Categoría de colección, usada para fines de prueba o amplios.' },
];

const rawArtworks = [
    { "id": 1, "path": "abstract-art-7093399_1920.jpg", "categorias": ["Arte", "Digital", "Abstracto"], "autor": "Alejandro Ortiz" },
    { "id": 2, "path": "ai-generated-8592847.png", "categorias": ["Arte", "Retratos", "Abstracto"], "autor": "Andrea Rivas" },
    { "id": 3, "path": "ai-generated-8592850.png", "categorias": ["Retratos", "Arte", "Abstracto"], "autor": "Samuel Torres" },
    { "id": 4, "path": "ai-generated-8913807.jpg", "categorias": ["Esculturas", "Arte", "Pinturas"], "autor": "Andrea Rivas" },
    { "id": 5, "path": "art-542320.jpg", "categorias": ["Retratos", "Arte", "Objetos"], "autor": "Samuel Torres" },
    { "id": 6, "path": "art-542324_1920.jpg", "categorias": ["Retratos", "Arte", "Pinturas"], "autor": "Andrea Rivas" },
    { "id": 7, "path": "art-1844712.jpg", "categorias": ["Construcciones", "Arte", "Objetos"], "autor": "Samuel Torres" },
    { "id": 8, "path": "auguste-rodin-954134.jpg", "categorias": ["Esculturas", "Arte", "Personas"], "autor": "Alejandro Ortiz" },
    { "id": 9, "path": "auguste-rodin-954136_1920.jpg", "categorias": ["Esculturas", "Arte", "Retratos"], "autor": "Andrea Rivas" },
    { "id": 10, "path": "berlin-4933295_1920.jpg", "categorias": ["Construcciones", "Esculturas", "Animales"], "autor": "Alejandro Ortiz" },
    { "id": 11, "path": "berlin-5014741.jpg", "categorias": ["Arte", "Objetos", "Pinturas"], "autor": "Samuel Torres" },
    { "id": 12, "path": "berlin-wall-50727_1280.jpg", "categorias": ["Vehículos", "Arte", "Pinturas"], "autor": "Andrea Rivas" },
    { "id": 13, "path": "bird-7553736_1920.jpg", "categorias": ["Animales", "Arte", "Objetos"], "autor": "Alejandro Ortiz" },
    { "id": 14, "path": "boho-art-6654957_1920.jpg", "categorias": ["Paisajes", "Arte", "Digital"], "autor": "Samuel Torres" },
    { "id": 15, "path": "statue-2794910_1920.jpg", "categorias": ["Esculturas", "Personas", "Arte"], "autor": "Andrea Rivas" },
    { "id": 16, "path": "the-louvre-698942_1280.jpg", "categorias": ["Construcciones", "Personas", "Paisajes"], "autor": "Alejandro Ortiz" },
    { "id": 17, "path": "museum-2208028_1920.jpg", "categorias": ["Construcciones", "Esculturas", "Objetos"], "autor": "Samuel Torres" },
    { "id": 18, "path": "palace-598474.jpg", "categorias": ["Construcciones", "Paisajes", "Objetos"], "autor": "Andrea Rivas" },
    { "id": 19, "path": "hairstyler-733603_1920.jpg", "categorias": ["Arte", "Retratos", "Construcciones"], "autor": "Alejandro Ortiz" },
    { "id": 20, "path": "mural-336417.jpg", "categorias": ["Arte", "Personas", "Pinturas"], "autor": "Samuel Torres" }
];

const artworks = rawArtworks.map(obra => ({
    titulo: generateTitle(obra.path),
    descripcion: generateDescription(generateTitle(obra.path)),
    url_imagen: `/images/${obra.path}`,
    categorias: obra.categorias, 
    autor: obra.autor,
    ratings: generateRandomRatings(),
}));

module.exports = { users, categories, artworks };