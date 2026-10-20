const { Router } = require('express');
const Director = require('../models/Director');
const { validationResult, check } = require('express-validator');

const router = Router();

// crear director
router.post('/', [
    check('nombres', 'invalid.nombres').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let director = new Director();
        director.nombres = req.body.nombres;
        director.estado = req.body.estado;
        director.fechaCreacion = new Date();
        director.fechaActualizacion = new Date();

        director = await director.save();
        res.send(director);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear el director');
    }
});

// listar directores
router.get('/', async function (req, res) {
    try {
        const directores = await Director.find();
        res.send(directores);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al listar los directores');
    }
});

// listar solo los directores activos
router.get('/activos', async function (req, res) {
    try {
        const directores = await Director.find({ estado: 'Activo' });
        res.send(directores);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al listar los directores');
    }
});

// consultar un director por id
router.get('/:directorId', async function (req, res) {
    try {
        const director = await Director.findById(req.params.directorId);
        if (!director) {
            return res.status(404).send('El director no existe');
        }
        res.send(director);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar el director');
    }
});

// actualizar director
router.put('/:directorId', [
    check('nombres', 'invalid.nombres').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let director = await Director.findById(req.params.directorId);
        if (!director) {
            return res.status(404).send('El director no existe');
        }

        director.nombres = req.body.nombres;
        director.estado = req.body.estado;
        director.fechaActualizacion = new Date();

        director = await director.save();
        res.send(director);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el director');
    }
});

// eliminar director
router.delete('/:directorId', async function (req, res) {
    try {
        const director = await Director.findByIdAndDelete(req.params.directorId);
        if (!director) {
            return res.status(404).send('El director no existe');
        }
        res.send(director);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al eliminar el director');
    }
});

module.exports = router;
