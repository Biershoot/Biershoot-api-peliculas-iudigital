# API REST Películas - IU Digital

Evidencia de Aprendizaje 1 - Ingeniería Web II.

API REST hecha con NodeJs, Express y MongoDB para el caso de estudio de películas. Tiene los módulos de Género, Director, Productora, Tipo y Media (películas y series).

**Integrantes:**
- Alejandro Arango Calderón

## Tecnologías

- NodeJs
- Express
- MongoDB (Mongoose)
- express-validator
- Postman

## Base de datos

Se usó MongoDB con una colección por cada módulo:

**generos**: nombre, estado (Activo / Inactivo), descripcion, fechaCreacion, fechaActualizacion

**directors**: nombres, estado (Activo / Inactivo), fechaCreacion, fechaActualizacion

**productoras**: nombre, estado (Activo / Inactivo), slogan, descripcion, fechaCreacion, fechaActualizacion

**tipos**: nombre, descripcion, fechaCreacion, fechaActualizacion

**medias**: serial (único), titulo, sinopsis, url (única), imagen, anioEstreno, genero, director, productora, tipo, fechaCreacion, fechaActualizacion

En media los campos genero, director, productora y tipo guardan el id del registro de su colección (relación con `ref` de mongoose). Al crear o editar una media solo se permiten géneros, directores y productoras que estén **Activos**.

## Cómo ejecutar

1. Instalar las dependencias:
```
npm install
```
2. Crear un archivo `.env` como el `.env.example` con la cadena de conexión de MongoDB Atlas:
```
PORT=4000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/peliculas
```
3. Correr el proyecto:
```
npm run dev
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | /genero | Crear género |
| GET | /genero | Listar géneros |
| GET | /genero/activos | Listar géneros activos |
| GET | /genero/:id | Consultar género |
| PUT | /genero/:id | Actualizar género |
| DELETE | /genero/:id | Eliminar género |
| POST | /director | Crear director |
| GET | /director | Listar directores |
| GET | /director/activos | Listar directores activos |
| GET | /director/:id | Consultar director |
| PUT | /director/:id | Actualizar director |
| DELETE | /director/:id | Eliminar director |
| POST | /productora | Crear productora |
| GET | /productora | Listar productoras |
| GET | /productora/activas | Listar productoras activas |
| GET | /productora/:id | Consultar productora |
| PUT | /productora/:id | Actualizar productora |
| DELETE | /productora/:id | Eliminar productora |
| POST | /tipo | Crear tipo |
| GET | /tipo | Listar tipos |
| GET | /tipo/:id | Consultar tipo |
| PUT | /tipo/:id | Actualizar tipo |
| DELETE | /tipo/:id | Eliminar tipo |
| POST | /media | Crear película o serie |
| GET | /media | Listar medias |
| GET | /media/:id | Consultar media |
| PUT | /media/:id | Actualizar media |
| DELETE | /media/:id | Eliminar media |

Ejemplo para crear una media:
```json
{
    "serial": "IUD-001",
    "titulo": "Interstellar",
    "sinopsis": "Un grupo de exploradores viaja a través de un agujero de gusano...",
    "url": "https://peliculas.iudigital.edu.co/interstellar",
    "imagen": "https://image.tmdb.org/t/p/w500/interstellar.jpg",
    "anioEstreno": 2014,
    "genero": "id del genero",
    "director": "id del director",
    "productora": "id de la productora",
    "tipo": "id del tipo"
}
```

## Postman

En la carpeta `postman` está la colección con todas las peticiones. Se importa en Postman y se ejecuta en orden: Genero, Director, Productora, Tipo, Media y Eliminar.

## Despliegue (EA3)

La API está desplegada en **Render** como Web Service y la base de datos en **MongoDB Atlas**.

- URL de la API: https://api-peliculas-iudigital-tab0.onrender.com
- Build command: `npm install`
- Start command: `npm start`
- Variable de entorno: `MONGO_URI` (cadena de conexión de Atlas). Render asigna el `PORT` solo.
- En Atlas, en *Network Access*, se agregó `0.0.0.0/0` para que Render se pueda conectar.

La ruta `GET /` responde un mensaje para comprobar que la API está funcionando. También está el archivo `render.yaml` con esta configuración.
