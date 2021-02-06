const jwt = require("jwt-simple");
const moment = require("moment");

exports.createAccessToken = function (user) {
  const payload = {
    id: user._id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    createToken: moment().unix(),
    exp: moment().add(3, "hours").unix(),
  };

  return jwt.encode(payload, process.env.SEED);
};

exports.createRefreshToken = function (user) {
  const payload = {
    id: user._id,
    exp: moment().add(30, "days").unix(),
  };
  return jwt.encode(payload, process.env.SEED);
};

exports.decodedToken = function (token) {
  return jwt.decode(token, process.env.SEED, true);
};
