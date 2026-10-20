const mongoose = require('mongoose');

// Middleware central de errores: traduce los errores de Mongoose a respuestas HTTP claras.
// eslint-disable-next-line no-unused-vars
const manejarErrores = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const errores = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: 'Datos inválidos', errores });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ mensaje: `Valor inválido para el campo '${err.path}': ${err.value}` });
  }

  // Índice único duplicado (ej: nombre, serial o url repetidos)
  if (err.code === 11000) {
    const campos = Object.keys(err.keyValue || {}).join(', ');
    return res.status(409).json({ mensaje: `Ya existe un registro con el mismo valor en: ${campos}` });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }

  if (err.status) {
    return res.status(err.status).json({ mensaje: err.message });
  }

  console.error(err);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
};

module.exports = manejarErrores;
