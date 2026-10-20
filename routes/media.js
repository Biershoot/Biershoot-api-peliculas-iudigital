const { Router } = require('express');
const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const { validationResult, check } = require('express-validator');

const router = Router();

const validaciones = [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('titulo', 'invalid.titulo').not().isEmpty(),
    check('url', 'invalid.url').not().isEmpty(),
    check('anioEstreno', 'invalid.anioEstreno').isInt({ min: 1888 }),
    check('genero', 'invalid.genero').isMongoId(),
    check('director', 'invalid.director').isMongoId(),
    check('productora', 'invalid.productora').isMongoId(),
    check('tipo', 'invalid.tipo').isMongoId(),
];

// segun el caso de estudio solo se pueden seleccionar generos, directores
// y productoras activos, y tipos que existan
const validarRelaciones = async (body) => {
    const genero = await Genero.findOne({ _id: body.genero, estado: 'Activo' });
    if (!genero) {
        return 'El género no existe o está inactivo';
    }

    const director = await Director.findOne({ _id: body.director, estado: 'Activo' });
    if (!director) {
        return 'El director no existe o está inactivo';
    }

    const productora = await Productora.findOne({ _id: body.productora, estado: 'Activo' });
    if (!productora) {
        return 'La productora no existe o está inactiva';
    }

    const tipo = await Tipo.findById(body.tipo);
    if (!tipo) {
        return 'El tipo no existe';
    }

    return null;
}

// crear media
router.post('/', validaciones, async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeSerial = await Media.findOne({ serial: req.body.serial });
        if (existeSerial) {
            return res.status(400).send('Ya existe una media con ese serial');
        }

        const existeUrl = await Media.findOne({ url: req.body.url });
        if (existeUrl) {
            return res.status(400).send('Ya existe una media con esa url');
        }

        const errorRelacion = await validarRelaciones(req.body);
        if (errorRelacion) {
            return res.status(400).send(errorRelacion);
        }

        let media = new Media();
        media.serial = req.body.serial;
        media.titulo = req.body.titulo;
        media.sinopsis = req.body.sinopsis;
        media.url = req.body.url;
        media.imagen = req.body.imagen;
        media.anioEstreno = req.body.anioEstreno;
        media.genero = req.body.genero;
        media.director = req.body.director;
        media.productora = req.body.productora;
        media.tipo = req.body.tipo;
        media.fechaCreacion = new Date();
        media.fechaActualizacion = new Date();

        media = await media.save();
        res.send(media);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear la media');
    }
});

// listar medias, con populate para traer los datos de genero, director, productora y tipo
router.get('/', async function (req, res) {
    try {
        const medias = await Media.find().populate([
            { path: 'genero', select: 'nombre estado' },
            { path: 'director', select: 'nombres estado' },
            { path: 'productora', select: 'nombre estado' },
            { path: 'tipo', select: 'nombre' },
        ]);
        res.send(medias);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al listar las medias');
    }
});

// consultar una media por id
router.get('/:mediaId', async function (req, res) {
    try {
        const media = await Media.findById(req.params.mediaId).populate([
            { path: 'genero', select: 'nombre estado' },
            { path: 'director', select: 'nombres estado' },
            { path: 'productora', select: 'nombre estado' },
            { path: 'tipo', select: 'nombre' },
        ]);
        if (!media) {
            return res.status(404).send('La media no existe');
        }
        res.send(media);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar la media');
    }
});

// actualizar media
router.put('/:mediaId', validaciones, async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let media = await Media.findById(req.params.mediaId);
        if (!media) {
            return res.status(404).send('La media no existe');
        }

        const existeSerial = await Media.findOne({ serial: req.body.serial, _id: { $ne: media._id } });
        if (existeSerial) {
            return res.status(400).send('Ya existe una media con ese serial');
        }

        const existeUrl = await Media.findOne({ url: req.body.url, _id: { $ne: media._id } });
        if (existeUrl) {
            return res.status(400).send('Ya existe una media con esa url');
        }

        const errorRelacion = await validarRelaciones(req.body);
        if (errorRelacion) {
            return res.status(400).send(errorRelacion);
        }

        media.serial = req.body.serial;
        media.titulo = req.body.titulo;
        media.sinopsis = req.body.sinopsis;
        media.url = req.body.url;
        media.imagen = req.body.imagen;
        media.anioEstreno = req.body.anioEstreno;
        media.genero = req.body.genero;
        media.director = req.body.director;
        media.productora = req.body.productora;
        media.tipo = req.body.tipo;
        media.fechaActualizacion = new Date();

        media = await media.save();
        res.send(media);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar la media');
    }
});

// eliminar media
router.delete('/:mediaId', async function (req, res) {
    try {
        const media = await Media.findByIdAndDelete(req.params.mediaId);
        if (!media) {
            return res.status(404).send('La media no existe');
        }
        res.send(media);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al eliminar la media');
    }
});

module.exports = router;
