const jwt = require("jwt-simple");
const moment = require("moment");

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      ok: false,
      message: "La petición no tiene cabecera de Autenticación",
    });
  }
  const token = req.headers.authorization.replace(/['"']+/g, "");

  try {
    var payload = jwt.decode(token, process.env.SEED);

    if (payload.exp <= moment.unix()) {
      return res.status(400).send({
        ok: false,
        message: "El token ha expirado",
      });
    }
  } catch (ex) {
    console.log(ex);
    return res.status(404).send({
      ok: false,
      message: "Token invalido",
    });
  }

  req.user = payload;
  next();
};

//---------------------------
// Verificar Admin
//---------------------------

exports.ensureAdminRole = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      ok: false,
      message: "La petición no tiene cabecera de Autenticación",
    });
  }
  const token = req.headers.authorization.replace(/['"']+/g, "");

  var usuario = jwt.decode(token, process.env.SEED);
  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.json({
      ok: false,
      message: "El usuario no es administrador",
    });
  }
};
