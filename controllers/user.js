const bcrypt = require("bcrypt");
const User = require("../models/user");

async function signUp(req, res) {
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
    email,
    password: bcrypt.hashSync(password, 10),
  });

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).send({
        ok: false,
        message: "Error en la base de datos",
        err,
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

module.exports = { signUp };
