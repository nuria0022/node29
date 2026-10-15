// Registra en la terminal cada petición 
function registrarPeticion(req, res, next) {
    const hora = new Date().toLocaleTimeString("es-ES");
    console.log(`${req.method} ${req.originalUrl} - ${hora}`);
    next();
}

module.exports = registrarPeticion;