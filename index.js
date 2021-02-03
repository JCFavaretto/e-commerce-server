const mongoose = require("mongoose");
const app = require("./app");

const { API_VERSION, IP_SERVER, PORT_DB } = require("./config/config");

mongoose.set("useFindAndModify", false);

mongoose.connect(
  process.env.URLDB,
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("La conexion a la base de datos es correcta.");
      app.listen(process.env.PORT, () => {
        console.log("Escuchando el puerto", process.env.PORT);
      });
    }
  }
);
