const Order = require("../models/orders");

function createBuyOrder(req, res) {
  const {
    comprador,
    calle,
    altura,
    depto,
    piso,
    telefono,
    cart,
    total,
  } = req.body;

  if (!calle || !altura || !telefono) {
    return res.status(400).json({
      ok: false,
      message: "Los campos de 'Calle', 'Altura' y 'Telefono' son obligatorios",
    });
  }

  let order = new Order({
    comprador,
    calle,
    altura,
    depto,
    piso,
    telefono,
    cart,
    total,
  });

  order.save((err, orderDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error en la base de datos. Intente mas tarde.",
        err,
      });
    }
    if (!orderDB) {
      return res.status(400).json({
        ok: false,
        message: "La compra no fue almacenada correctamente.",
      });
    }
    res.json({
      ok: true,
      order: orderDB,
    });
  });
}

module.exports = { createBuyOrder };
