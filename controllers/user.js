const bcrypt = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("../services/jwt");
const User = require("../models/user");

function signUp(req, res) {
  const { name, lastName, email, password, repeatPassword } = req.body;

  if (!password) {
    return res.status(404).json({
      ok: false,
      message: "Debe ingresar una contraseña",
    });
  }

  if (password !== repeatPassword) {
    return res.status(400).json({
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
      return res.status(400).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    } else {
      if (!userDB) {
        res.status(404).json({
          ok: false,
          message: "Error al crear el usuario",
        });
      } else {
        res.status(200).json({ ok: true, user: userDB });
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
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    } else {
      if (!userDB) {
        return res.status(404).json({
          ok: false,
          message: "Usuario no encontrado",
        });
      } else {
        bcrypt.compare(password, userDB.password, (err, check) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              message: "Error en la base de datos. Intente mas tarde.",
              err,
            });
          }
          if (!check) {
            return res.status(404).json({
              ok: false,
              message: "La contraseña es incorrecta",
            });
          } else {
            if (!userDB.active) {
              return res.status(200).json({
                ok: false,
                message: "Usuario no activo",
              });
            } else {
              return res.status(200).json({
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
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }

    if (!users) {
      return res
        .status(404)
        .json({ ok: false, message: "No se ha encontrado ningun usuarios" });
    }

    User.countDocuments((err, totalUsuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      res.json({
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
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
      });
    }

    if (!users) {
      return res
        .status(404)
        .json({ ok: false, message: "No se ha encontrado ningun usuarios" });
    }

    User.countDocuments({ active: query.active }, (err, totalUsuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
        });
      }
      res.json({
        ok: true,
        totalUsuarios,
        users,
      });
    });
  });
}

function updateUsers(req, res) {
  const id = req.params.id;
  var user = req.body;

  user.email = req.body.email.toLowerCase();

  if (user.password) {
    user.password = bcrypt.hashSync(user.password, 10);
  }

  User.findByIdAndUpdate(
    id,
    user,
    { new: true, runValidators: true, context: "query" },
    (err, userDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error en la base de datos. Intente mas tarde.",
          err,
        });
      }
      if (!userDB) {
        return res.status(404).json({
          ok: false,
          message: "No se encontro el usuario.",
        });
      }
      res.json({
        ok: true,
        user: userDB,
      });
    }
  );
}

function changeStatus(req, res) {
  const id = req.params.id;
  const active = req.body.active;

  User.findByIdAndUpdate(id, { active }, { new: true }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        message: "No se encontro el usuario.",
      });
    }
    res.json({
      ok: true,
      user: userDB,
    });
  });
}

function deleteUser(req, res) {
  const id = req.params.id;

  User.findByIdAndRemove(id, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        message: "No se encontro el usuario.",
      });
    }
    res.json({
      ok: true,
      message: "Usuario eliminado.",
    });
  });
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getActiveUsers,
  updateUsers,
  changeStatus,
  deleteUser,
};
