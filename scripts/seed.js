// Carga los datos iniciales que pide el caso de estudio:
//   Géneros: acción, aventura, ciencia ficción, drama y terror
//   Tipos:   serie y película
// Uso: npm run seed   (no duplica registros si ya existen)
require('dotenv').config();
const mongoose = require('mongoose');

const Genero = require('../src/models/Genero');
const Tipo = require('../src/models/Tipo');

const GENEROS = [
  { nombre: 'Acción', descripcion: 'Películas y series con escenas de alta intensidad' },
  { nombre: 'Aventura', descripcion: 'Historias de viajes, exploración y descubrimiento' },
  { nombre: 'Ciencia ficción', descripcion: 'Historias basadas en avances científicos o tecnológicos' },
  { nombre: 'Drama', descripcion: 'Historias centradas en conflictos emocionales' },
  { nombre: 'Terror', descripcion: 'Historias que buscan provocar miedo o suspenso' },
];

const TIPOS = [
  { nombre: 'Película', descripcion: 'Producción audiovisual de una sola parte' },
  { nombre: 'Serie', descripcion: 'Producción audiovisual dividida en episodios o temporadas' },
];

const sembrar = async (Modelo, registros) => {
  for (const registro of registros) {
    await Modelo.updateOne({ nombre: registro.nombre }, { $setOnInsert: registro }, { upsert: true });
  }
};

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await sembrar(Genero, GENEROS);
  await sembrar(Tipo, TIPOS);
  console.log(`Datos iniciales cargados: ${GENEROS.length} géneros y ${TIPOS.length} tipos`);
  await mongoose.disconnect();
};

main().catch((error) => {
  console.error('Error cargando datos iniciales:', error.message);
  process.exit(1);
});
