const { Schema, model } = require('mongoose');
const { opcionesEsquema, campoEstado } = require('./opciones');

const ProductoraSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la productora es obligatorio'],
      trim: true,
      unique: true,
    },
    estado: campoEstado,
    slogan: { type: String, trim: true, default: '' },
    descripcion: { type: String, trim: true, default: '' },
  },
  opcionesEsquema
);

module.exports = model('Productora', ProductoraSchema);
