const { Router } = require('express');
const Productora = require('../models/Productora');
const { validationResult, check } = require('express-validator');

const router = Router();

// crear productora
router.post('/', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeProductora = await Productora.findOne({ nombre: req.body.nombre });
        if (existeProductora) {
            return res.status(400).send('Ya existe una productora con ese nombre');
        }

        let productora = new Productora();
        productora.nombre = req.body.nombre;
        productora.estado = req.body.estado;
        productora.slogan = req.body.slogan;
        productora.descripcion = req.body.descripcion;
        productora.fechaCreacion = new Date();
        productora.fechaActualizacion = new Date();

        productora = await productora.save();
        res.send(productora);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear la productora');
    }
});

// listar productoras
router.get('/', async function (req, res) {
    try {
        const productoras = await Productora.find();
        res.send(productoras);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al listar las productoras');
    }
});

// listar solo las productoras activas
router.get('/activas', async function (req, res) {
    try {
        const productoras = await Productora.find({ estado: 'Activo' });
        res.send(productoras);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al listar las productoras');
    }
});

// consultar una productora por id
router.get('/:productoraId', async function (req, res) {
    try {
        const productora = await Productora.findById(req.params.productoraId);
        if (!productora) {
            return res.status(404).send('La productora no existe');
        }
        res.send(productora);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar la productora');
    }
});

// actualizar productora
router.put('/:productoraId', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let productora = await Productora.findById(req.params.productoraId);
        if (!productora) {
            return res.status(404).send('La productora no existe');
        }

        const existeProductora = await Productora.findOne({ nombre: req.body.nombre, _id: { $ne: productora._id } });
        if (existeProductora) {
            return res.status(400).send('Ya existe una productora con ese nombre');
        }

        productora.nombre = req.body.nombre;
        productora.estado = req.body.estado;
        productora.slogan = req.body.slogan;
        productora.descripcion = req.body.descripcion;
        productora.fechaActualizacion = new Date();

        productora = await productora.save();
        res.send(productora);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar la productora');
    }
});

// eliminar productora
router.delete('/:productoraId', async function (req, res) {
    try {
        const productora = await Productora.findByIdAndDelete(req.params.productoraId);
        if (!productora) {
            return res.status(404).send('La productora no existe');
        }
        res.send(productora);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al eliminar la productora');
    }
});

module.exports = router;
