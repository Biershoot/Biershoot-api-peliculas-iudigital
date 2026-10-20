const { Router } = require('express');
const { isValidObjectId } = require('mongoose');

// Todos los módulos exponen los mismos verbos HTTP sobre su recurso:
//   GET    /       -> listar
//   GET    /:id    -> obtener uno
//   POST   /       -> crear
//   PUT    /:id    -> actualizar
//   DELETE /:id    -> eliminar
const crearRouter = (controlador) => {
  const router = Router();

  router.param('id', (req, res, next, id) => {
    if (!isValidObjectId(id)) return res.status(400).json({ mensaje: `El id '${id}' no es válido` });
    next();
  });

  router.get('/', controlador.listar);
  router.get('/:id', controlador.obtener);
  router.post('/', controlador.crear);
  router.put('/:id', controlador.actualizar);
  router.delete('/:id', controlador.eliminar);

  return router;
};

module.exports = crearRouter;
