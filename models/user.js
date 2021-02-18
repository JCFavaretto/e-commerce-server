const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

const validRoles = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol valido",
};

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "Ingrese el nombre"],
  },
  lastName: {
    type: String,
    required: [true, "Ingrese el apellido"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Ingrese el email"],
  },
  password: {
    type: String,
    required: [true, "Ingrese la contraseña"],
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: validRoles,
  },
  active: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: String,
    required: false,
    default: null,
  },
  calle: {
    type: String,
    required: false,
  },

  altura: {
    type: Number,
    required: false,
  },
  depto: {
    type: String,
    required: false,
  },
  piso: {
    type: String,
    required: false,
  },
  telefono: {
    type: String,
    required: false,
  },
  orders: {
    type: [Schema.Types.ObjectId],
    required: false,
  },
});

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

UserSchema.plugin(uniqueValidator, { message: "Ese {PATH} ya existe." });

module.exports = mongoose.model("User", UserSchema);
