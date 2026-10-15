// Qué dirección llama a qué función, y qué middlewares pasan antes
const express = require("express");
const router = express.Router();

const productosController = require("../controllers/productosController");
const verificarApiKey = require("../middlewares/verificarApiKey");
const { validarProductoNuevo, validarCambiosProducto } = require("../middlewares/validarProducto");

// Lectura: pública
router.get("/", productosController.listar);
router.get("/:id", productosController.obtenerPorId);

// Escritura: primero la clave, después la validación, y por último el controlador
router.post("/", verificarApiKey, validarProductoNuevo, productosController.crear);
router.put("/:id", verificarApiKey, validarCambiosProducto, productosController.actualizar);
router.delete("/:id", verificarApiKey, productosController.eliminar);

module.exports = router;