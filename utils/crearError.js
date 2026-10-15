// Fabrica un error con su código de estado y una lista de detalles(opcional)
function crearError(codigo, mensaje, detalles) {
    const error = new Error(mensaje);
    error.status = codigo;
    error.detalles = detalles;
    return error;
}

module.exports = crearError;