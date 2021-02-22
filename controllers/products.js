const Product = require("../models/products");

function crearProducto(req, res) {
  const { nombre, precio, descripcion, stock, categoria, oferta } = req.body;

  if (!nombre || !precio || !descripcion || !stock || !categoria) {
    return res.status(400).json({
      ok: false,
      message: "Debe completar todos los campos.",
    });
  }

  let producto = new Product({
    nombre,
    precio,
    descripcion,
    stock,
    categoria,
    oferta,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        message: "No se ha podido crear el producto",
      });
    }
    res.json({
      ok: true,
      producto: productoDB,
    });
  });
}

function editarProducto(req, res) {
  const id = req.params.id;
  var body = req.body;

  Product.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: "query" },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      if (!productoDB) {
        return res.status(404).json({
          ok: false,
          message: "No se encontro el producto.",
        });
      }
      res.json({
        ok: true,
        producto: productoDB,
      });
    }
  );
}

function changeStatus(req, res) {
  const id = req.params.id;
  const active = req.body.active;

  Product.findByIdAndUpdate(
    id,
    { active },
    { new: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      if (!productoDB) {
        return res.status(404).json({
          ok: false,
          message: "No se encontro el producto.",
        });
      }
      res.json({
        ok: true,
        user: productoDB,
      });
    }
  );
}

function obtenerProductos(req, res) {
  Product.find({ stock: { $gt: 0 } }).exec((err, productosDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    Product.countDocuments({ stock: { $gt: 0 } }, (err, conteo) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      res.json({
        ok: true,
        conteo,
        productos: productosDB,
      });
    });
  });
}

function obtenerProductosporCategoria(req, res) {
  let categoria = req.query.categoria;

  Product.find({ stock: { $gt: 0 }, categoria }).exec((err, productosDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    Product.countDocuments({ stock: { $gt: 0 }, categoria }, (err, conteo) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      res.json({
        ok: true,
        conteo,
        productos: productosDB,
      });
    });
  });
}

function obtenerProductosEnOferta(req, res) {
  Product.find({ active: true, stock: { $gt: 0 }, oferta: true }).exec(
    (err, productosDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      Product.countDocuments(
        { stock: { $gt: 0 }, oferta: true },
        (err, conteo) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              message: "Error en la base de datos. Intente mas tarde.",
              err,
            });
          }
          res.json({
            ok: true,
            conteo,
            productos: productosDB,
          });
        }
      );
    }
  );
}

function obtenerTodosProductos(req, res) {
  Product.find().exec((err, productosDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    Product.countDocuments((err, conteo) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      res.json({
        ok: true,
        conteo,
        productos: productosDB,
      });
    });
  });
}

function obtenerUnProducto(req, res) {
  const id = req.params.id;

  Product.findById(id).exec((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    if (!productoDB) {
      return res.status(404).json({
        ok: false,
        message: "No se encontro el producto.",
      });
    }
    res.json({
      ok: true,
      producto: productoDB,
    });
  });
}

function obtenerProductosActivos(req, res) {
  const query = req.query;

  Product.find({ active: query.active }).exec((err, productosDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    Product.countDocuments({ active: query.active }, (err, conteo) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      res.json({
        ok: true,
        conteo,
        productos: productosDB,
      });
    });
  });
}

function eliminarProducto(req, res) {
  const id = req.params.id;
  Product.findByIdAndRemove(id, (err, producto) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: "No se encontro el producto.",
      });
    }
    res.json({
      ok: true,
      message: "Producto Eliminado.",
    });
  });
}

module.exports = {
  crearProducto,
  editarProducto,
  changeStatus,
  obtenerProductos,
  obtenerTodosProductos,
  obtenerUnProducto,
  obtenerProductosActivos,
  eliminarProducto,
  obtenerProductosporCategoria,
  obtenerProductosEnOferta,
};
