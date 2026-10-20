const mongoose = require('mongoose');

const getConnection = async () => {
    try {
        const url = process.env.MONGO_URI;

        await mongoose.connect(url);

        console.log('Conexión exitosa a MongoDB');
    } catch (error) {
        console.log('Error al conectar con MongoDB', error);
    }
}

module.exports = {
    getConnection,
}
