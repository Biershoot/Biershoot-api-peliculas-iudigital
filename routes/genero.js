const { Router } = require('express');
const Genero = require('../models/Genero');
const { validationResult, check } = require('express-validator');

const router = Router();

// crear genero
router.post('/', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeGenero = await Genero.findOne({ nombre: req.body.nombre });
        if (existeGenero) {
            return res.status(400).send('Ya existe un género con ese nombre');
        }

        let genero = new Genero();
        genero.nombre = req.body.nombre;
        genero.estado = req.body.estado;
        genero.descripcion = req.body.descripcion;
        genero.fechaCreacion = new Date();
        genero.fechaActualizacion = new Date();

        genero = await genero.save();
        res.send(genero);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el género');
    }
});

// listar generos
router.get('/', async function (req, res) {
    try {
        const generos = await Genero.find();
        res.send(generos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al listar los géneros');
    }
});

// listar solo los generos activos
router.get('/activos', async function (req, res) {
    try {
        const generos = await Genero.find({ estado: 'Activo' });
        res.send(generos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al listar los géneros');
    }
});

// consultar un genero por id
router.get('/:generoId', async function (req, res) {
    try {
        const genero = await Genero.findById(req.params.generoId);
        if (!genero) {
            return res.status(404).send('El género no existe');
        }
        res.send(genero);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar el género');
    }
});

// actualizar genero
router.put('/:generoId', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let genero = await Genero.findById(req.params.generoId);
        if (!genero) {
            return res.status(404).send('El género no existe');
        }

        const existeGenero = await Genero.findOne({ nombre: req.body.nombre, _id: { $ne: genero._id } });
        if (existeGenero) {
            return res.status(400).send('Ya existe un género con ese nombre');
        }

        genero.nombre = req.body.nombre;
        genero.estado = req.body.estado;
        genero.descripcion = req.body.descripcion;
        genero.fechaActualizacion = new Date();

        genero = await genero.save();
        res.send(genero);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el género');
    }
});

// eliminar genero
router.delete('/:generoId', async function (req, res) {
    try {
        const genero = await Genero.findByIdAndDelete(req.params.generoId);
        if (!genero) {
            return res.status(404).send('El género no existe');
        }
        res.send(genero);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al eliminar el género');
    }
});

module.exports = router;
