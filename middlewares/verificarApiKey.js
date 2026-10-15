// Protege las rutas que modifican datos
const crearError = require("../utils/crearError");

function verificarApiKey(req, res, next) {
    const claveRecibida = req.headers["x-api-key"];

    if (claveRecibida !== process.env.API_KEY) {
        throw crearError(401, "No autorizado");
    }

    next();
}

module.exports = verificarApiKey;