const jwt = require("jwt-simple");
const moment = require("moment");

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.autorization) {
    return res.status(403).send({
      ok: false,
      message: "La petición no tiene cabecera de Autenticación",
    });
  }
  const token = req.headers.autorization.replace(/['"']+/g, "");

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
