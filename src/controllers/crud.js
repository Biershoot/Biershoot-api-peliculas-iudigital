const { envolver, errorHttp, tomarCampos, tomarFiltros } = require('../helpers/utilidades');

/**
 * Genera los controladores CRUD (listar, obtener, crear, actualizar, eliminar) para un modelo.
 *
 * @param {import('mongoose').Model} Modelo
 * @param {object} config
 * @param {string}   config.entidad          Nombre legible para los mensajes (ej: 'Género')
 * @param {string[]} config.campos           Campos que el cliente puede enviar en POST/PUT
 * @param {string[]} [config.filtros]        Campos por los que se puede filtrar en GET (?estado=Activo)
 * @param {Function} [config.estaEnUso]      async (id) => boolean. Si devuelve true no se permite eliminar
 */
const crearControladorCrud = (Modelo, { entidad, campos, filtros = [], estaEnUso }) => {
  const buscarOFallar = async (id) => {
    const documento = await Modelo.findById(id);
    if (!documento) throw errorHttp(404, `${entidad} no encontrado(a) con id ${id}`);
    return documento;
  };

  return {
    // GET /
    listar: envolver(async (req, res) => {
      const consulta = tomarFiltros(req.query, filtros);
      const documentos = await Modelo.find(consulta).sort({ fechaCreacion: -1 });
      res.json(documentos);
    }),

    // GET /:id
    obtener: envolver(async (req, res) => {
      res.json(await buscarOFallar(req.params.id));
    }),

    // POST /
    crear: envolver(async (req, res) => {
      const documento = await Modelo.create(tomarCampos(req.body, campos));
      res.status(201).json(documento);
    }),

    // PUT /:id
    actualizar: envolver(async (req, res) => {
      const documento = await buscarOFallar(req.params.id);
      documento.set(tomarCampos(req.body, campos));
      await documento.save(); // save() ejecuta validaciones y actualiza fechaActualizacion
      res.json(documento);
    }),

    // DELETE /:id
    eliminar: envolver(async (req, res) => {
      const documento = await buscarOFallar(req.params.id);
      if (estaEnUso && (await estaEnUso(documento._id))) {
        throw errorHttp(409, `No se puede eliminar: el/la ${entidad.toLowerCase()} está asociado(a) a una o más medias`);
      }
      await documento.deleteOne();
      res.json({ mensaje: `${entidad} eliminado(a) correctamente`, documento });
    }),
  };
};

module.exports = { crearControladorCrud };
