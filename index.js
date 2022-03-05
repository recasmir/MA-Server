const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config(); //cuando la aplicación carga, lee este archivo de environments

//crear el servidor/aplicación de express

const app = express();

//Connexión bbdd
dbConnection();

//Directorio públic
app.use(express.static('public'));

//CORS
app.use(cors());

//Lectura y parseo del body (transformar lo que viene en el body)
app.use(express.json());

//Rutas - usamos middleware use. Cualquier ruta que se encuentre aqui va a tener /api/auth delante
app.use( '/api/auth', require('./routes/auth') );


app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
} )