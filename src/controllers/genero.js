const Genero = require('../models/Genero');
const Media = require('../models/Media');
const { crearControladorCrud } = require('./crud');

module.exports = crearControladorCrud(Genero, {
  entidad: 'Género',
  campos: ['nombre', 'estado', 'descripcion'],
  filtros: ['estado'],
  estaEnUso: (id) => Media.exists({ genero: id }),
});
