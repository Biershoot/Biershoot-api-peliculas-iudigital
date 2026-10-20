const Tipo = require('../models/Tipo');
const Media = require('../models/Media');
const { crearControladorCrud } = require('./crud');

module.exports = crearControladorCrud(Tipo, {
  entidad: 'Tipo',
  campos: ['nombre', 'descripcion'],
  estaEnUso: (id) => Media.exists({ tipo: id }),
});
