const Productora = require('../models/Productora');
const Media = require('../models/Media');
const { crearControladorCrud } = require('./crud');

module.exports = crearControladorCrud(Productora, {
  entidad: 'Productora',
  campos: ['nombre', 'estado', 'slogan', 'descripcion'],
  filtros: ['estado'],
  estaEnUso: (id) => Media.exists({ productora: id }),
});
