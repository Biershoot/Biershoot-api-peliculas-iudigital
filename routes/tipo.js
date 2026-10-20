const { Router } = require('express');
const Tipo = require('../models/Tipo');
const { validationResult, check } = require('express-validator');

const router = Router();

// crear tipo
router.post('/', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeTipo = await Tipo.findOne({ nombre: req.body.nombre });
        if (existeTipo) {
            return res.status(400).send('Ya existe un tipo con ese nombre');
        }

        let tipo = new Tipo();
        tipo.nombre = req.body.nombre;
        tipo.descripcion = req.body.descripcion;
        tipo.fechaCreacion = new Date();
        tipo.fechaActualizacion = new Date();

        tipo = await tipo.save();
        res.send(tipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el tipo');
    }
});

// listar tipos
router.get('/', async function (req, res) {
    try {
        const tipos = await Tipo.find();
        res.send(tipos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al listar los tipos');
    }
});

// consultar un tipo por id
router.get('/:tipoId', async function (req, res) {
    try {
        const tipo = await Tipo.findById(req.params.tipoId);
        if (!tipo) {
            return res.status(404).send('El tipo no existe');
        }
        res.send(tipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar el tipo');
    }
});

// actualizar tipo
router.put('/:tipoId', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let tipo = await Tipo.findById(req.params.tipoId);
        if (!tipo) {
            return res.status(404).send('El tipo no existe');
        }

        const existeTipo = await Tipo.findOne({ nombre: req.body.nombre, _id: { $ne: tipo._id } });
        if (existeTipo) {
            return res.status(400).send('Ya existe un tipo con ese nombre');
        }

        tipo.nombre = req.body.nombre;
        tipo.descripcion = req.body.descripcion;
        tipo.fechaActualizacion = new Date();

        tipo = await tipo.save();
        res.send(tipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el tipo');
    }
});

// eliminar tipo
router.delete('/:tipoId', async function (req, res) {
    try {
        const tipo = await Tipo.findByIdAndDelete(req.params.tipoId);
        if (!tipo) {
            return res.status(404).send('El tipo no existe');
        }
        res.send(tipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al eliminar el tipo');
    }
});

module.exports = router;
