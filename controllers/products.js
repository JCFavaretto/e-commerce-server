const Product = require("../models/products");

function crearProducto(req, res) {
  const { nombre, precio, descripcion, stock, categoria } = req.body;

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

module.exports = {
  editarProducto,
  crearProducto,
  obtenerProductos,
  obtenerTodosProductos,
  obtenerUnProducto,
};
