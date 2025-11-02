# Instalación y Configuración
Sigue estos pasos para poner en marcha el servidor de forma local.

# Paso 1: 
Corre el comando npm install para instalar todos los paquetes necesarios (express, mongoose, dotenv, etc.)

# Paso 2: MondoDB
Asegurate de tener instalado MongoDB, si ya lo tienes instalado continua, si un no lo instalas ve a https://www.mongodb.com/try/download/community y descarga e instala MongoDB


# Paso 3: Ejecución de la base de datos
Una vez completada la instalación y configuración, puedes iniciar la base de datos:

mongod

este te dara el MONGO_URI para hacer la conexion

# Paso 3: Configuración de Variables de Entorno
El proyecto utiliza el paquete dotenv para manejar variables de entorno. Necesitas crear un archivo llamado .env en la raíz de la carpeta backend/ y añadir tus configuraciones sensibles:

# Archivo: .env
# ----------------------------------------------------------------

# Puerto de ejecución del servidor
PORT=5000

# Cadena de conexión a MongoDB (LOCAL o ATLAS)
MONGO_URI=mongodb+srv://[usuario]:[contraseña]@cluster0.xxxx.mongodb.net/[nombre-de-tu-db]?retryWrites=true&w=majority

# Clave secreta para la generación de tokens (JWT o similar)
SECRET_KEY=TU_CLAVE_SECRETA_LARGA_Y_COMPLEJA

# Paso 4: Ejecución del Servidor
Una vez completada la instalación y configuración, puedes iniciar el servidor:

npm start
# o, si estás usando un script de desarrollo con nodemon:
npm run dev

El servidor estará operativo en el puerto definido (por defecto, 5000). Podrás acceder a la API en la siguiente URL base:

http://localhost:5000/api/





