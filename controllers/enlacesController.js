const Enlaces = require("../models/Enlace");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoEnlace = async (req, res, next) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //crear un objeto
  const { nombre_original, password } = req.body;

  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = shortid.generate();
  enlace.nombre_original = nombre_original;

  //si el usuario esta autenticado
  if (req.usuario) {
    const { password, descargas } = req.body;

    //asignar al enlace un numero de descargas
    if (descargas) {
      enlace.descargas = descargas;
    }

    //asignar un password
    if (password) {
      const salt = await bcrypt.genSalt(10);

      enlace.password = await bcrypt.hash(password, salt);
    }

    //asignar el autor
    enlace.autor = req.usuario.id;
  }

  //almacenar enlace en la BD
  try {
    await enlace.save();
    return res.json({ msg: `${enlace.url}` });
    next();
  } catch (error) {
    console.log(error);
  }
};
