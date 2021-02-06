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
            return res.status(500).send({
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

module.exports = { signUp, signIn };
