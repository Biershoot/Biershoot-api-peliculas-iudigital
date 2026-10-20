const Director = require('../models/Director');
const Media = require('../models/Media');
const { crearControladorCrud } = require('./crud');

module.exports = crearControladorCrud(Director, {
  entidad: 'Director',
  campos: ['nombres', 'estado'],
  filtros: ['estado'],
  estaEnUso: (id) => Media.exists({ director: id }),
});
