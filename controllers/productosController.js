// La lógica de cada endpoint de productos
const { leerProductos, guardarProductos } = require("../models/productosModel");
const crearError = require("../utils/crearError");

const LIMITE_POR_DEFECTO = 10;
const LIMITE_MAXIMO = 50;

// ---------- FUNCIONES DE AYUDA (privadas: no se exportan) ----------

// Saca el id de la ruta y comprueba que sea un entero positivo
function leerId(req) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        throw crearError(400, "El id debe ser un número entero positivo");
    }
    return id;
}

// Convierte un parámetro de la query en entero positivo, o usa el valor por defecto
function leerEnteroPositivo(valor, nombre, porDefecto) {
    if (valor === undefined) {
        return porDefecto;
    }
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 1) {
        throw crearError(400, `${nombre} debe ser un número entero positivo`);
    }
    return numero;
}

// Convierte un parámetro de la query en número, o devuelve null si no vino
function leerNumero(valor, nombre) {
    if (valor === undefined) {
        return null;
    }
    const numero = Number(valor);
    if (valor.trim() === "" || !Number.isFinite(numero)) {
        throw crearError(400, `${nombre} debe ser un número`);
    }
    return numero;
}

// El id siguiente: el más alto que exista, más 1 
function calcularSiguienteId(productos) {
    let maximo = 0;
    for (const producto of productos) {
        if (producto.id > maximo) {
            maximo = producto.id;
        }
    }
    return maximo + 1;
}

// ---------- ENDPOINTS ----------

// GET /productos?buscar=&categoria=&precioMin=&precioMax=&pagina=&limite=
async function listar(req, res) {
    // 1) Leer y validar los parámetros
    const buscar = typeof req.query.buscar === "string" ? req.query.buscar.trim().toLowerCase() : "";
    const categoria = typeof req.query.categoria === "string" ? req.query.categoria.trim().toLowerCase() : "";
    const precioMin = leerNumero(req.query.precioMin, "precioMin");
    const precioMax = leerNumero(req.query.precioMax, "precioMax");
    const pagina = leerEnteroPositivo(req.query.pagina, "pagina", 1);
    const limite = Math.min(leerEnteroPositivo(req.query.limite, "limite", LIMITE_POR_DEFECTO), LIMITE_MAXIMO);

    // 2) Filtrar (búsqueda y filtros)
    const productos = await leerProductos();

    const filtrados = productos.filter(function (p) {
        if (buscar !== "" && !p.nombre.toLowerCase().includes(buscar)) {
            return false;
        }
        if (categoria !== "" && p.categoria.toLowerCase() !== categoria) {
            return false;
        }
        if (precioMin !== null && p.precio < precioMin) {
            return false;
        }
        if (precioMax !== null && p.precio > precioMax) {
            return false;
        }
        return true;
    });

    // 3) Paginar
    const inicio = (pagina - 1) * limite;
    const datosPagina = filtrados.slice(inicio, inicio + limite);

    res.json({
        success: true,
        data: datosPagina,
        paginacion: {
            pagina: pagina,
            limite: limite,
            total: filtrados.length,
            totalPaginas: Math.ceil(filtrados.length / limite),
        },
    });
}

// GET /productos/:id
async function obtenerPorId(req, res) {
    const id = leerId(req);
    const productos = await leerProductos();

    const producto = productos.find(function (p) {
        return p.id === id;
    });
    if (!producto) {
        throw crearError(404, "Producto no encontrado");
    }

    res.json({ success: true, data: producto });
}

// POST /productos (los datos ya llegan validados por el middleware)
async function crear(req, res) {
    const productos = await leerProductos();

    const nuevoProducto = {
        id: calcularSiguienteId(productos),
        nombre: req.body.nombre.trim(),
        categoria: req.body.categoria.trim().toLowerCase(),
        precio: req.body.precio,
        stock: req.body.stock,
    };

    productos.push(nuevoProducto);
    await guardarProductos(productos);

    res.status(201).json({ success: true, data: nuevoProducto });
}

// PUT /productos/:id (solo cambia los campos que vengan)
async function actualizar(req, res) {
    const id = leerId(req);
    const productos = await leerProductos();

    const producto = productos.find(function (p) {
        return p.id === id;
    });
    if (!producto) {
        throw crearError(404, "Producto no encontrado");
    }

    const datos = req.body;
    if (datos.nombre !== undefined) producto.nombre = datos.nombre.trim();
    if (datos.categoria !== undefined) producto.categoria = datos.categoria.trim().toLowerCase();
    if (datos.precio !== undefined) producto.precio = datos.precio;
    if (datos.stock !== undefined) producto.stock = datos.stock;

    await guardarProductos(productos);

    res.json({ success: true, data: producto });
}

// DELETE /productos/:id
async function eliminar(req, res) {
    const id = leerId(req);
    const productos = await leerProductos();

    const posicion = productos.findIndex(function (p) {
        return p.id === id;
    });
    if (posicion === -1) {
        throw crearError(404, "Producto no encontrado");
    }

    const eliminado = productos.splice(posicion, 1)[0];
    await guardarProductos(productos);

    res.json({ success: true, data: eliminado });
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };