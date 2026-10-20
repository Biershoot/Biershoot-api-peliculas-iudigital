require('dotenv').config();

const app = require('./app');
const { conectarDB } = require('./db/conexion');

const PORT = process.env.PORT || 4000;

const iniciar = async () => {
  await conectarDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`API de películas escuchando en http://localhost:${PORT}`);
  });
};

iniciar();
