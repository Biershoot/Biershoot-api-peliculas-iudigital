// Prueba de punta a punta de la API usando una base de datos MongoDB en memoria.
// No necesita MongoDB instalado. Uso: npm test
process.env.NODE_ENV = 'test';

const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let base;
const pasos = [];

const http = async (metodo, ruta, body) => {
  const res = await fetch(base + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
};

const paso = async (nombre, fn) => {
  await fn();
  pasos.push(nombre);
  console.log(`  ✔ ${nombre}`);
};

const main = async () => {
  const mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await mongoose.connection.syncIndexes();
  const server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;

  const ids = {};

  try {
    console.log('Módulo Género');
    await paso('POST crea género', async () => {
      const r = await http('POST', '/api/generos', { nombre: 'Acción', descripcion: 'Mucha acción' });
      assert.equal(r.status, 201);
      assert.equal(r.data.estado, 'Activo');
      assert.ok(r.data.fechaCreacion && r.data.fechaActualizacion);
      ids.genero = r.data._id;
    });
    await paso('POST rechaza género sin nombre (400)', async () => {
      const r = await http('POST', '/api/generos', { descripcion: 'x' });
      assert.equal(r.status, 400);
    });
    await paso('POST rechaza género duplicado (409)', async () => {
      const r = await http('POST', '/api/generos', { nombre: 'Acción' });
      assert.equal(r.status, 409);
    });
    await paso('POST rechaza estado inválido (400)', async () => {
      const r = await http('POST', '/api/generos', { nombre: 'Drama', estado: 'Borrado' });
      assert.equal(r.status, 400);
    });
    await paso('PUT actualiza género y cambia fechaActualizacion', async () => {
      const antes = (await http('GET', `/api/generos/${ids.genero}`)).data;
      await new Promise((r) => setTimeout(r, 15));
      const r = await http('PUT', `/api/generos/${ids.genero}`, { descripcion: 'Escenas de alta intensidad' });
      assert.equal(r.status, 200);
      assert.equal(r.data.descripcion, 'Escenas de alta intensidad');
      assert.ok(new Date(r.data.fechaActualizacion) > new Date(antes.fechaActualizacion));
      assert.equal(r.data.fechaCreacion, antes.fechaCreacion);
    });
    await paso('GET lista y filtra por estado', async () => {
      await http('POST', '/api/generos', { nombre: 'Terror', estado: 'Inactivo' });
      const todos = await http('GET', '/api/generos');
      const activos = await http('GET', '/api/generos?estado=Activo');
      assert.equal(todos.data.length, 2);
      assert.equal(activos.data.length, 1);
    });
    await paso('GET con id inválido (400) e inexistente (404)', async () => {
      assert.equal((await http('GET', '/api/generos/abc')).status, 400);
      assert.equal((await http('GET', `/api/generos/${new mongoose.Types.ObjectId()}`)).status, 404);
    });

    console.log('Módulo Director');
    await paso('POST crea director y PUT lo actualiza', async () => {
      const c = await http('POST', '/api/directores', { nombres: 'Christopher Nolan' });
      assert.equal(c.status, 201);
      ids.director = c.data._id;
      const u = await http('PUT', `/api/directores/${ids.director}`, { nombres: 'Christopher Edward Nolan' });
      assert.equal(u.status, 200);
      assert.equal(u.data.nombres, 'Christopher Edward Nolan');
    });

    console.log('Módulo Productora');
    await paso('POST crea productora y PUT la actualiza', async () => {
      const c = await http('POST', '/api/productoras', { nombre: 'Warner Bros', slogan: 'The stuff that dreams are made of' });
      assert.equal(c.status, 201);
      ids.productora = c.data._id;
      const u = await http('PUT', `/api/productoras/${ids.productora}`, { descripcion: 'Estudio estadounidense' });
      assert.equal(u.status, 200);
      assert.equal(u.data.descripcion, 'Estudio estadounidense');
      assert.equal(u.data.slogan, 'The stuff that dreams are made of');
    });

    console.log('Módulo Tipo');
    await paso('POST crea tipo y PUT lo actualiza', async () => {
      const c = await http('POST', '/api/tipos', { nombre: 'Película' });
      assert.equal(c.status, 201);
      assert.equal(c.data.estado, undefined);
      ids.tipo = c.data._id;
      const u = await http('PUT', `/api/tipos/${ids.tipo}`, { descripcion: 'Producción de una sola parte' });
      assert.equal(u.status, 200);
    });

    console.log('Módulo Media');
    const media = () => ({
      serial: 'MED-001',
      titulo: 'Inception',
      sinopsis: 'Un ladrón que roba secretos a través de los sueños',
      url: 'https://peliculas.iudigital.edu.co/inception',
      imagenPortada: 'https://image.tmdb.org/t/p/w500/inception.jpg',
      anioEstreno: 2010,
      genero: ids.genero,
      director: ids.director,
      productora: ids.productora,
      tipo: ids.tipo,
    });
    await paso('POST crea media con relaciones pobladas', async () => {
      const r = await http('POST', '/api/medias', media());
      assert.equal(r.status, 201, JSON.stringify(r.data));
      assert.equal(r.data.genero.nombre, 'Acción');
      assert.equal(r.data.director.nombres, 'Christopher Edward Nolan');
      assert.equal(r.data.tipo.nombre, 'Película');
      ids.media = r.data._id;
    });
    await paso('POST rechaza serial o URL duplicados (409)', async () => {
      assert.equal((await http('POST', '/api/medias', { ...media(), url: 'https://otra.com/x' })).status, 409);
      assert.equal((await http('POST', '/api/medias', { ...media(), serial: 'MED-002' })).status, 409);
    });
    await paso('POST rechaza género inactivo (400)', async () => {
      const terror = (await http('GET', '/api/generos?estado=Inactivo')).data[0];
      const r = await http('POST', '/api/medias', { ...media(), serial: 'MED-003', url: 'https://a.com/3', genero: terror._id });
      assert.equal(r.status, 400);
      assert.match(r.data.mensaje, /Inactivo/);
    });
    await paso('POST rechaza director inactivo y tipo inexistente (400)', async () => {
      const d = await http('POST', '/api/directores', { nombres: 'Director Inactivo', estado: 'Inactivo' });
      const r1 = await http('POST', '/api/medias', { ...media(), serial: 'MED-004', url: 'https://a.com/4', director: d.data._id });
      assert.equal(r1.status, 400);
      const r2 = await http('POST', '/api/medias', { ...media(), serial: 'MED-005', url: 'https://a.com/5', tipo: new mongoose.Types.ObjectId() });
      assert.equal(r2.status, 400);
    });
    await paso('POST rechaza campos obligatorios faltantes (400)', async () => {
      const r = await http('POST', '/api/medias', { titulo: 'Sin datos' });
      assert.equal(r.status, 400);
      assert.ok(r.data.errores.length >= 5);
    });
    await paso('PUT actualiza media', async () => {
      const r = await http('PUT', `/api/medias/${ids.media}`, { titulo: 'El origen', anioEstreno: 2010 });
      assert.equal(r.status, 200);
      assert.equal(r.data.titulo, 'El origen');
      assert.equal(r.data.genero.nombre, 'Acción');
    });
    await paso('GET lista medias y filtra por título', async () => {
      const r = await http('GET', '/api/medias?titulo=orig');
      assert.equal(r.data.length, 1);
      assert.equal((await http('GET', '/api/medias?titulo=nada')).data.length, 0);
    });
    await paso('DELETE no permite borrar un género en uso (409)', async () => {
      assert.equal((await http('DELETE', `/api/generos/${ids.genero}`)).status, 409);
    });
    await paso('DELETE elimina media y luego el género', async () => {
      assert.equal((await http('DELETE', `/api/medias/${ids.media}`)).status, 200);
      assert.equal((await http('GET', `/api/medias/${ids.media}`)).status, 404);
      assert.equal((await http('DELETE', `/api/generos/${ids.genero}`)).status, 200);
    });
    await paso('Ruta inexistente (404) y JSON inválido (400)', async () => {
      assert.equal((await http('GET', '/api/nada')).status, 404);
      const res = await fetch(`${base}/api/generos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{malo' });
      assert.equal(res.status, 400);
    });

    console.log(`\nTodas las pruebas pasaron (${pasos.length})`);
  } finally {
    server.close();
    await mongoose.disconnect();
    await mongo.stop();
  }
};

main().catch((error) => {
  console.error('\n✘ Falló una prueba:', error.message);
  process.exit(1);
});
