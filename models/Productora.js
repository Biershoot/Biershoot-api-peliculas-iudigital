const { Schema, model } = require('mongoose');

const ProductoraSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
        enum: ['Activo', 'Inactivo'],
    },
    slogan: {
        type: String,
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

module.exports = model('Productora', ProductoraSchema);
