// Capa de datos: las únicas funciones del proyecto que saben que hay un archivo

const fs = require("fs/promises"); //para leer y escribir archivos con await
const path = require("path"); //para construir las rutas d elos archivos

// El archivo de trabajo: cambia al usar la API y NO se sube a GitHub
const RUTA_DATOS = path.join(__dirname, "..", "data", "productos.json");

// Los datos iniciales: no se tocan nunca y SÍ se suben a GitHub
const RUTA_SEMILLA = path.join(__dirname, "..", "data", "productos.semilla.json");

// Función que devuelve el array de productos
async function leerProductos() {
    try {
        const texto = await fs.readFile(RUTA_DATOS, "utf-8");
        return JSON.parse(texto);
    } catch (error) {
        // Si todavía no existe el archivo de trabajo, arranco con la semilla
        if (error.code === "ENOENT") {
            const semilla = await fs.readFile(RUTA_SEMILLA, "utf-8");
            return JSON.parse(semilla);
        }
        throw error;
    }
}

// Guarda el array completo
async function guardarProductos(productos) {
    const texto = JSON.stringify(productos, null, 2);
    await fs.writeFile(RUTA_DATOS, texto, "utf-8");
}

module.exports = { leerProductos, guardarProductos };