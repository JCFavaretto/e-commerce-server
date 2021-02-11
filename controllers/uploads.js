const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const Product = require("../models/products");

function uploadImage(req, res) {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      message: "No se subio ningun archivo",
    });
  }

  // Valida tipo
  let tiposValidos = ["productos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      message: "Los tipos permitidos son: " + tiposValidos.join(", "),
      tipo,
    });
  }

  // Extensiones permitidas -- El input que lo suba se tiene q llamar "archivo"
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split(".");
  let extension = nombreCortado[nombreCortado.length - 1];

  let extensionesValidas = ["png", "jpg", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      message:
        "Las extensiones permitidas son: " + extensionesValidas.join(", "),
      extension,
    });
  }
  // Cambiar nombre de los archivos
  let name = `${id}.${extension}`;

  archivo.mv(`uploads/${tipo}/${name}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    if (tipo === "usuarios") {
      imagenUsuario(id, res, name);
    } else {
      imagenProducto(id, res, name);
    }
  });
}

function imagenUsuario(id, res, nombreArchivo) {
  User.findById(id, (err, usuario) => {
    if (err) {
      borrarArchivo(nombreArchivo, "usuarios");
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }

    if (!usuario) {
      borrarArchivo(nombreArchivo, "usuarios");
      return res.status(400).json({
        ok: false,
        message: "El usuario no existe en la base de datos",
      });
    }

    borrarArchivo(usuario.img, "usuarios");

    usuario.avatar = nombreArchivo;

    usuario.save((err, usuarioBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }

      res.json({
        ok: true,
        user: usuarioBD,
        img: nombreArchivo,
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Product.findById(id, (err, producto) => {
    if (err) {
      borrarArchivo(nombreArchivo, "productos");
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }

    if (!producto) {
      borrarArchivo(nombreArchivo, "productos");
      return res.status(400).json({
        ok: false,
        message: "El producto no existe en la base de datos",
      });
    }

    borrarArchivo(producto.img, "productos");

    producto.img = nombreArchivo;

    producto.save((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      if (!productoDB) {
        borrarArchivo(nombreArchivo, "productos");
        return res.status(400).json({
          ok: false,
          message: "El producto no pudo ser actualizado",
        });
      }

      res.json({
        ok: true,
        product: productoDB,
        img: nombreArchivo,
      });
    });
  });
}

function borrarArchivo(nombre, tipo) {
  let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombre}`);
  if (fs.existsSync(pathUrl)) {
    fs.unlinkSync(pathUrl);
  }
}

function getImagen(req, res) {
  let tipo = req.params.tipo;
  let img = req.params.img;

  let pathImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    let noImagePath = path.resolve(__dirname, "../assets/img/no-avatar.png");
    res.sendFile(noImagePath);
  }
}

module.exports = { uploadImage, getImagen };
