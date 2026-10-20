const { isValidObjectId } = require('mongoose');

const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const {
  envolver, errorHttp, tomarCampos, tomarFiltros, escaparRegex,
} = require('../helpers/utilidades');

const CAMPOS = [
  'serial', 'titulo', 'sinopsis', 'url', 'imagenPortada', 'anioEstreno',
  'genero', 'director', 'productora', 'tipo',
];
const FILTROS = ['genero', 'director', 'productora', 'tipo', 'anioEstreno'];

const POPULAR = [
  { path: 'genero', select: 'nombre estado' },
  { path: 'director', select: 'nombres estado' },
  { path: 'productora', select: 'nombre estado' },
  { path: 'tipo', select: 'nombre' },
];

// Reglas del caso de estudio: solo se pueden asociar géneros, directores y productoras ACTIVOS,
// y tipos que existan en el módulo Tipo.
const REFERENCIAS = [
  { campo: 'genero', Modelo: Genero, entidad: 'género', exigeActivo: true },
  { campo: 'director', Modelo: Director, entidad: 'director', exigeActivo: true },
  { campo: 'productora', Modelo: Productora, entidad: 'productora', exigeActivo: true },
  { campo: 'tipo', Modelo: Tipo, entidad: 'tipo', exigeActivo: false },
];

const validarReferencias = async (datos) => {
  for (const { campo, Modelo, entidad, exigeActivo } of REFERENCIAS) {
    const id = datos[campo];
    if (id === undefined) continue; // en PUT solo se validan los campos enviados

    if (!isValidObjectId(id)) throw errorHttp(400, `El id de ${entidad} no es válido: ${id}`);

    const referencia = await Modelo.findById(id);
    if (!referencia) throw errorHttp(400, `No existe el/la ${entidad} con id ${id}`);
    if (exigeActivo && referencia.estado !== 'Activo') {
      throw errorHttp(400, `El/la ${entidad} '${referencia.nombre || referencia.nombres}' está Inactivo(a) y no se puede asignar`);
    }
  }
};

const buscarOFallar = async (id) => {
  const media = await Media.findById(id);
  if (!media) throw errorHttp(404, `Media no encontrada con id ${id}`);
  return media;
};

// GET /api/medias  (filtros opcionales: ?genero=&director=&productora=&tipo=&anioEstreno=&titulo=)
const listar = envolver(async (req, res) => {
  const consulta = tomarFiltros(req.query, FILTROS);
  if (typeof req.query.titulo === 'string' && req.query.titulo) {
    consulta.titulo = { $regex: escaparRegex(req.query.titulo), $options: 'i' };
  }

  const medias = await Media.find(consulta).populate(POPULAR).sort({ fechaCreacion: -1 });
  res.json(medias);
});

// GET /api/medias/:id
const obtener = envolver(async (req, res) => {
  const media = await buscarOFallar(req.params.id);
  res.json(await media.populate(POPULAR));
});

// POST /api/medias
const crear = envolver(async (req, res) => {
  const datos = tomarCampos(req.body, CAMPOS);
  await validarReferencias(datos);

  const media = await Media.create(datos);
  res.status(201).json(await media.populate(POPULAR));
});

// PUT /api/medias/:id
const actualizar = envolver(async (req, res) => {
  const media = await buscarOFallar(req.params.id);
  const datos = tomarCampos(req.body, CAMPOS);
  await validarReferencias(datos);

  media.set(datos);
  await media.save();
  res.json(await media.populate(POPULAR));
});

// DELETE /api/medias/:id
const eliminar = envolver(async (req, res) => {
  const media = await buscarOFallar(req.params.id);
  await media.deleteOne();
  res.json({ mensaje: 'Media eliminada correctamente', documento: media });
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
