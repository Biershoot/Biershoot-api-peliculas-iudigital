const { Schema, model } = require('mongoose');
const { opcionesEsquema } = require('./opciones');

const anioMaximo = () => new Date().getFullYear() + 5;

const MediaSchema = new Schema(
  {
    serial: {
      type: String,
      required: [true, 'El serial es obligatorio'],
      trim: true,
      unique: true,
    },
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    sinopsis: { type: String, trim: true, default: '' },
    url: {
      type: String,
      required: [true, 'La URL de la película es obligatoria'],
      trim: true,
      unique: true,
      match: [/^https?:\/\/\S+$/i, 'La URL de la película no es válida'],
    },
    imagenPortada: {
      type: String,
      trim: true,
      default: '',
    },
    anioEstreno: {
      type: Number,
      required: [true, 'El año de estreno es obligatorio'],
      min: [1888, 'El año de estreno no puede ser menor a 1888'],
      validate: {
        validator: (valor) => valor <= anioMaximo(),
        message: 'El año de estreno no es válido',
      },
    },
    genero: {
      type: Schema.Types.ObjectId,
      ref: 'Genero',
      required: [true, 'El género principal es obligatorio'],
    },
    director: {
      type: Schema.Types.ObjectId,
      ref: 'Director',
      required: [true, 'El director principal es obligatorio'],
    },
    productora: {
      type: Schema.Types.ObjectId,
      ref: 'Productora',
      required: [true, 'La productora es obligatoria'],
    },
    tipo: {
      type: Schema.Types.ObjectId,
      ref: 'Tipo',
      required: [true, 'El tipo es obligatorio'],
    },
  },
  opcionesEsquema
);

module.exports = model('Media', MediaSchema, 'medias');
