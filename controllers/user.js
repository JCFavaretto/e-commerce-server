const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("../services/jwt");
const User = require("../models/user");

function signUp(req, res) {
  const { name, lastName, email, password, repeatPassword } = req.body;

  if (!password) {
    return res.status(404).send({
      ok: false,
      message: "Debe ingresar una contraseña",
    });
  }

  if (password !== repeatPassword) {
    return res.status(406).send({
      ok: false,
      message: "Las contraseñas no coinciden",
    });
  }

  const user = new User({
    name,
    lastName,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 10),
  });

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).send({
        ok: false,
        message: err.message,
      });
    } else {
      if (!userDB) {
        res.status(404).send({
          ok: false,
          message: "Error al crear el usuario",
        });
      } else {
        res.status(200).send({ ok: true, user: userDB });
      }
    }
  });
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, userDB) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor",
      });
    } else {
      if (!userDB) {
        return res.status(404).send({
          ok: false,
          message: "Usuario no encontrado",
        });
      } else {
        bcrypt.compare(password, userDB.password, (err, check) => {
          if (err) {
            return res.status(500).send({
              ok: false,
              message: "Error del servidor",
            });
          }
          if (!check) {
            return res.status(404).send({
              ok: false,
              message: "La contraseña es incorrecta",
            });
          } else {
            if (!userDB.active) {
              return res.status(200).send({
                ok: false,
                message: "Usuario no activo",
              });
            } else {
              return res.status(200).send({
                ok: true,
                accessToken: createAccessToken(userDB),
                refreshToken: createRefreshToken(userDB),
              });
            }
          }
        });
      }
    }
  });
}

function getUsers(req, res) {
  User.find().exec((err, users) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
      });
    }

    if (!users) {
      return res
        .status(404)
        .send({ ok: false, message: "No se ha encontrado ningun usuarios" });
    }

    User.countDocuments((err, totalUsuarios) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
        });
      }
      res.send({
        ok: true,
        totalUsuarios,
        users,
      });
    });
  });
}

function getActiveUsers(req, res) {
  const query = req.query;

  User.find({ active: query.active }).exec((err, users) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
      });
    }

    if (!users) {
      return res
        .status(404)
        .send({ ok: false, message: "No se ha encontrado ningun usuarios" });
    }

    User.countDocuments({ active: query.active }, (err, totalUsuarios) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
        });
      }
      res.send({
        ok: true,
        totalUsuarios,
        users,
      });
    });
  });
}

function uploadAvatar(req, res) {
  const { id } = req.params;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se subio ningun archivo",
      },
    });
  }

  User.findById({ _id: id }, (err, userDB) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
      });
    }
    if (!userDB) {
      return res
        .status(404)
        .send({ ok: false, message: "No se ha encontrado ningun usuario" });
    }

    let extSpli = req.files.avatar.path.split(".");
    let ext = extSpli[extSpli.length - 1];

    let extensionesValidas = ["png", "jpg", "jpeg"];
    if (extensionesValidas.indexOf(ext) < 0) {
      return res.status(400).send({
        ok: false,
        message:
          "Las extensiones permitidas son: " + extensionesValidas.join(", "),
      });
    }
    // Cambiar nombre de los archivos
    let name = `${id}.${ext}`;

    userDB.avatar = name;

    User.findByIdAndUpdate(id, userDB, { new: true }, (err, userUpdated) => {
      if (err) {
        return res.status(500).send({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
        });
      }
      res.send({
        ok: true,
        user: userUpdated,
      });
    });
  });
}

module.exports = { signUp, signIn, getUsers, getActiveUsers, uploadAvatar };
