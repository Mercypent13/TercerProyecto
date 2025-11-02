const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path');

const usuarioRoutes = require('./routes/usuarioRoutes');
const obrasRoutes = require('./routes/obrasRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');

dotenv.config({path: '.env'});

const app = express();

const mongoUri = process.env.MONGODB_URI;
console.log(mongoUri)
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/obras', obrasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/images', express.static(path.join(__dirname, 'uploads', 'images')));

app.use(express.static(path.join(__dirname, 'public')));

const connectDB = async () => {
  console.log(mongoUri)
    try {
        await mongoose.connect(mongoUri);
        console.log('Conexión a MongoDB establecida con éxito.');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Bienvenido a la API Backend de tu Proyecto Final. El servidor Express está funcionando.',
        status: 'OK',
        endpoints: {
            usuarios: '/api/usuarios',
            obras: '/api/obras',
            categorias: '/api/categorias'
        }
    });
});

const startServer = () => {
    app.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port} = ${mongoUri}`);
        console.log(`Verifica el endpoint inicial en: http://localhost:${port}/`);
    });
};

connectDB().then(startServer);
