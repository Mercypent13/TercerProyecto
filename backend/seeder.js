const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const Usuario = require('./models/Usuario'); 
const Categoria = require('./models/Categorias'); 
const Obra = require('./models/Obras'); 

const { users, categories, artworks } = require('./data/sampleData'); 

dotenv.config({ path: '.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB conectado para SEEDER`);
    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();
        const usersWithHashedPasswords = await Promise.all(users.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.contrasena, salt);
            return { ...user, contrasena: hashedPassword };
        }));

        const createdUsers = await Usuario.insertMany(usersWithHashedPasswords);
        await Categoria.insertMany(categories);
        console.log('✅ Categorías cargadas.');

        const userMap = createdUsers.reduce((map, user) => {
            map[user.nombre] = user._id; 
            return map;
        }, {});
        console.log('✅ Usuarios cargados y contraseñas hasheadas.');
        
        const sampleArtworks = artworks.map((obra) => {
            const autorId = userMap[obra.autor]; 
            
            if (!autorId) {
                 throw new Error(`Error de mapeo: Autor no encontrado para ${obra.autor}`);
            }

            const mappedRatings = obra.ratings.map(rating => {
                const userId = userMap[rating.user_name];
                if (!userId) {
                    console.warn(`Advertencia: Usuario ${rating.user_name} no encontrado para rating.`);
                    return null; 
                }
                return {
                    user: userId,
                    score: rating.score
                };
            }).filter(rating => rating !== null);
            
            const totalScore = mappedRatings.reduce((sum, r) => sum + r.score, 0);
            const averageRating = mappedRatings.length > 0 ? totalScore / mappedRatings.length : 0;

            return {
                ...obra,
                autor: autorId, 
                ratings: mappedRatings,
                averageRating: averageRating
            };
        });

        await Obra.insertMany(sampleArtworks);
        console.log(`✅ ${sampleArtworks.length} Obras cargadas y enlazadas a autores y ratings.`);

        console.log('🎉 Datos de la base de datos cargados con éxito.');
        process.exit();

    } catch (error) {
        console.error(`❌ ERROR AL IMPORTAR DATOS: ${error.message}`);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await connectDB();

        await Obra.deleteMany();
        await Usuario.deleteMany();
        await Categoria.deleteMany();

        console.log('✅ Datos existentes eliminados con éxito.');
    } catch (error) {
        console.error(`❌ ERROR AL ELIMINAR DATOS: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    deleteData();
} else {
    deleteData().then(() => importData());
}