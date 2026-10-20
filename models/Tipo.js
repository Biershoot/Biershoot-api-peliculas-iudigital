const { Schema, model } = require('mongoose');

// el tipo no tiene estado segun el caso de estudio
const TipoSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
    },
    fechaCreacion: {
        type: Date,
        required: true,
    },
    fechaActualizacion: {
        type: Date,
        required: true,
    },
});

module.exports = model('Tipo', TipoSchema);
