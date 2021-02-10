const express = require("express");
const ProductController = require("../controllers/products");
const md_auth = require("../middleware/authenticated");

const app = express();

app.post(
  "/crear-producto",
  [md_auth.ensureAuth, md_auth.ensureAdminRole],
  ProductController.crearProducto
);

app.put(
  "/editar-producto/:id",
  [md_auth.ensureAuth, md_auth.ensureAdminRole],
  ProductController.editarProducto
);

app.put(
  "/cambiar-estado-producto/:id",
  [md_auth.ensureAuth, md_auth.ensureAdminRole],
  ProductController.changeStatus
);

app.get("/obtener-productos", ProductController.obtenerProductos);

app.get(
  "/obtener-todos-productos",
  [md_auth.ensureAuth, md_auth.ensureAdminRole],
  ProductController.obtenerTodosProductos
);

app.get("/producto/:id", ProductController.obtenerUnProducto);

app.get(
  "/productos-activos",
  [md_auth.ensureAuth, md_auth.ensureAdminRole],
  ProductController.obtenerProductosActivos
);

app.delete(
  "/eliminar-producto/:id",
  [md_auth.ensureAuth, md_auth.ensureAdminRole],
  ProductController.eliminarProducto
);

module.exports = app;
