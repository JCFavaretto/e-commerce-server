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

app.get("/obtener-productos", ProductController.obtenerProductos);

app.get(
  "/obtener-todos-productos",
  [md_auth.ensureAuth, md_auth.ensureAdminRole],
  ProductController.obtenerTodosProductos
);

app.get("/producto/:id", ProductController.obtenerUnProducto);

module.exports = app;
