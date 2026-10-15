// Punto de entrada: crea la aplicación, conecta las piezas y la enciende

const express = require("express");

const productosRoutes = require("./routes/productos");
const registrarPeticion = require("./middlewares/registrarPeticion");
const { rutaNoEncontrada, manejarErrores } = require("./middlewares/errores");

// Render indica el puerto en la variable PORT; en mi ordenador uso el 3000
const PUERTO = process.env.PORT || 3000;

// Sin API_KEY, las rutas protegidas quedarían abiertas: me niego a arrancar
if (!process.env.API_KEY) {
    console.error("Falta la variable API_KEY. Arranca con: npm run dev");
    process.exit(1);
}

const app = express();

// Middlewares que se aplican a todas las peticiones
app.use(express.json());
app.use(registrarPeticion);

// Ruta de bienvenida: sirve para comprobar que la API está viva
app.get("/", function (req, res) {
    res.json({
        success: true,
        mensaje: "API de gestión de productos",
        endpoints: ["/productos"],
    });
});

// Todas las rutas de productos cuelgan de /productos
app.use("/productos", productosRoutes);

// Siempre al final, en este orden
app.use(rutaNoEncontrada);
app.use(manejarErrores);

app.listen(PUERTO, function () {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});