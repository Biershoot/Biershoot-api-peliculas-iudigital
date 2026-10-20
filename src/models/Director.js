const { Schema, model } = require('mongoose');
const { opcionesEsquema, campoEstado } = require('./opciones');

const DirectorSchema = new Schema(
  {
    nombres: {
      type: String,
      required: [true, 'Los nombres del director son obligatorios'],
      trim: true,
    },
    estado: campoEstado,
  },
  opcionesEsquema
);

module.exports = model('Director', DirectorSchema, 'directores');
