// Opciones comunes a todos los esquemas:
// - timestamps con los nombres que pide el caso de estudio (fecha de creación / actualización)
// - sin el campo interno __v en las respuestas
const opcionesEsquema = {
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' },
  versionKey: false,
};

const ESTADOS = ['Activo', 'Inactivo'];

const campoEstado = {
  type: String,
  enum: { values: ESTADOS, message: "El estado debe ser 'Activo' o 'Inactivo'" },
  default: 'Activo',
};

module.exports = { opcionesEsquema, ESTADOS, campoEstado };
