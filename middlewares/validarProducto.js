// Validaciones de los datos de un producto 
const crearError = require("../utils/crearError");

// Revisa los campos que vengan y devuelve una lista con los problemas encontrados. Si "todosObligatorios" es true, además exige que estén todos
function buscarProblemas(datos, todosObligatorios) {
    const problemas = [];

    // nombre: texto no vacío, de 100 caracteres como máximo
    if (datos.nombre !== undefined || todosObligatorios) {
        if (typeof datos.nombre !== "string" || datos.nombre.trim() === "") {
            problemas.push("nombre debe ser un texto no vacío");
        } else if (datos.nombre.trim().length > 100) {
            problemas.push("nombre no puede superar los 100 caracteres");
        }
    }

    // categoria: texto no vacío
    if (datos.categoria !== undefined || todosObligatorios) {
        if (typeof datos.categoria !== "string" || datos.categoria.trim() === "") {
            problemas.push("categoria debe ser un texto no vacío");
        }
    }

    // precio: número mayor que 0
    if (datos.precio !== undefined || todosObligatorios) {
        if (typeof datos.precio !== "number" || !Number.isFinite(datos.precio) || datos.precio <= 0) {
            problemas.push("precio debe ser un número mayor que 0");
        }
    }

    // stock: entero mayor o igual que 0
    if (datos.stock !== undefined || todosObligatorios) {
        if (!Number.isInteger(datos.stock) || datos.stock < 0) {
            problemas.push("stock debe ser un número entero mayor o igual que 0");
        }
    }

    return problemas;
}

// Para POST: todos los campos son obligatorios
function validarProductoNuevo(req, res, next) {
    const problemas = buscarProblemas(req.body || {}, true);

    if (problemas.length > 0) {
        throw crearError(400, "Datos inválidos", problemas);
    }
    next();
}

// Para PUT: solo se revisan los campos que vengan, pero tiene que venir al menos uno
function validarCambiosProducto(req, res, next) {
    const datos = req.body || {};
    const camposPermitidos = ["nombre", "categoria", "precio", "stock"];

    const hayAlgunCampo = camposPermitidos.some(function (campo) {
        return datos[campo] !== undefined;
    });
    if (!hayAlgunCampo) {
        throw crearError(400, "Datos inválidos", ["no se ha enviado ningún campo para modificar"]);
    }

    const problemas = buscarProblemas(datos, false);
    if (problemas.length > 0) {
        throw crearError(400, "Datos inválidos", problemas);
    }
    next();
}

module.exports = { validarProductoNuevo, validarCambiosProducto };