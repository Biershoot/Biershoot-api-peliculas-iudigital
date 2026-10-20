const { Schema, model } = require('mongoose');
const { opcionesEsquema } = require('./opciones');

// El módulo Tipo no maneja estado según el caso de estudio.
const TipoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del tipo es obligatorio'],
      trim: true,
      unique: true,
    },
    descripcion: { type: String, trim: true, default: '' },
  },
  opcionesEsquema
);

module.exports = model('Tipo', TipoSchema);
