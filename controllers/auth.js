const jwt = require("../services/jwt");
const moment = require("moment");
const User = require("../models/user");

function willExpireToken(token) {
  const { exp } = jwt.decodedToken(token);
  const currentDate = moment().unix();

  if (currentDate > exp) {
    return true;
  }
  return false;
}

function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;
  const isTokenExpired = willExpireToken(refreshToken);

  if (isTokenExpired) {
    return res.status(404).json({
      ok: false,
      message: "El refreshToken ha expirado",
    });
  }

  const { id } = jwt.decodedToken(refreshToken);

  User.findById(id).exec((err, userDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: err.message,
      });
    }
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        message: "No se encontro el usuario",
      });
    }
    res.status(200).json({
      ok: true,
      accessToken: jwt.createAccessToken(userDB),
      refreshToken: refreshToken,
    });
  });
}

module.exports = {
  willExpireToken,
  refreshAccessToken,
};
