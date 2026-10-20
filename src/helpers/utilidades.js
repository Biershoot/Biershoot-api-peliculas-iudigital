// Express 4 no captura errores de funciones async: este envoltorio los envía al middleware de errores.
const envolver = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Crea un error con código HTTP para que el middleware de errores responda con ese status.
const errorHttp = (status, mensaje) => Object.assign(new Error(mensaje), { status });

// Toma del body solo los campos permitidos (evita que el cliente modifique _id, fechas, etc.).
const tomarCampos = (body = {}, campos) =>
  campos.reduce((datos, campo) => {
    if (body[campo] !== undefined) datos[campo] = body[campo];
    return datos;
  }, {});

// Igual que tomarCampos pero para filtros de la URL: solo acepta texto plano,
// así se evita que un query como ?estado[$ne]=x se convierta en un operador de MongoDB.
const tomarFiltros = (query = {}, campos) =>
  campos.reduce((filtros, campo) => {
    if (typeof query[campo] === 'string') filtros[campo] = query[campo];
    return filtros;
  }, {});

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { envolver, errorHttp, tomarCampos, tomarFiltros, escaparRegex };
