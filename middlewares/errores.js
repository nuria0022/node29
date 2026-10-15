// Manejo de errores centralizado
const crearError = require("../utils/crearError");

// Se ejecuta si ninguna ruta atendió la petición
function rutaNoEncontrada(req, res, next) {
    throw crearError(404, "Ruta no encontrada");
}

// Aquí terminan todos los errores. Los 4 parámetros son obligatorios
function manejarErrores(err, req, res, next) {
    // express.json() marca así el JSON mal escrito en el body
    if (err.type === "entity.parse.failed") {
        res.status(400).json({ success: false, error: "El cuerpo no es un JSON válido" });
        return;
    }

    const codigo = err.status || 500;

    // Errores inesperados: detalle a la terminal, mensaje genérico al cliente
    if (codigo === 500) {
        console.error("Error inesperado:", err);
        res.status(500).json({ success: false, error: "Error interno del servidor" });
        return;
    }

    const respuesta = { success: false, error: err.message };
    if (err.detalles) { //solo si detalles existe
        respuesta.detalles = err.detalles;
    }
    res.status(codigo).json(respuesta);
}

module.exports = { rutaNoEncontrada, manejarErrores };