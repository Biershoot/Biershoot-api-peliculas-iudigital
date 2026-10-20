const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const manejarErrores = require('./middlewares/manejar-errores');

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API REST - Películas y series IU Digital',
    endpoints: ['/api/generos', '/api/directores', '/api/productoras', '/api/tipos', '/api/medias'],
  });
});

app.use('/api/generos', require('./routes/genero'));
app.use('/api/directores', require('./routes/director'));
app.use('/api/productoras', require('./routes/productora'));
app.use('/api/tipos', require('./routes/tipo'));
app.use('/api/medias', require('./routes/media'));

app.use((req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use(manejarErrores);

module.exports = app;
