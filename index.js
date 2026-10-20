const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getConnection } = require('./db/db-connection-mongo');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

getConnection();

// para que el servidor entienda los json que llegan en el body
app.use(express.json());

app.use('/genero', require('./routes/genero'));
app.use('/director', require('./routes/director'));
app.use('/productora', require('./routes/productora'));
app.use('/tipo', require('./routes/tipo'));
app.use('/media', require('./routes/media'));

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
