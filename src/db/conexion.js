const mongoose = require('mongoose');

const conectarDB = async (uri) => {
  if (!uri) {
    console.error('Falta la variable de entorno MONGO_URI (revisa el archivo .env)');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { conectarDB };
