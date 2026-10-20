const { Schema, model } = require('mongoose');
const { opcionesEsquema, campoEstado } = require('./opciones');

const GeneroSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del género es obligatorio'],
      trim: true,
      unique: true,
    },
    estado: campoEstado,
    descripcion: { type: String, trim: true, default: '' },
  },
  opcionesEsquema
);

module.exports = model('Genero', GeneroSchema);
