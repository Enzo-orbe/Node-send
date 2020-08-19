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
  const { nombre_original, nombre } = req.body;

  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = nombre;
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


//obtiene un listado de todos los enlaces 
exports.todosEnlaces = async (req, res) => {
  try {
    const enlaces = await Enlaces.find({}).select("url -_id");
    res.json({ enlaces });
  } catch (error) {
    console.log(error)
  }
}


//retorna si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {

  const { url } = req.params;
  //verificar si existe enlace
  const enlace = await Enlaces.findOne({ url })

  if (!enlace) {
    res.status(401).json({ msg: "Enlace no existente" })
    return next();
  }

  if (enlace.password) {
    return res.json({ password: true, enlace: enlace.url, archivo: enlace.nombre });
  }

  next();

}

//verificar si el pssword es correcto
exports.verificarPassword = async (req, res, next) => {
  const { url } = req.params;
  const { password } = req.body;

  //Consultar por el enlace
  const enlace = await Enlaces.findOne({ url });

  //verificar el password
  if (bcrypt.compareSync(password, enlace.password)) {
    //descargar el archivo
    next();
  } else {
    return res.status(401).json({ msg: "Password incorrecto" })
  }

}


//obtener enlace 
exports.obtenerEnlace = async (req, res, next) => {

  const { url } = req.params;
  //verificar si existe enlace
  const enlace = await Enlaces.findOne({ url })

  if (!enlace) {
    res.status(401).json({ msg: "Enlace no existente" })
    return next();
  }

  //si el enlace existe 
  res.json({ archivo: enlace.nombre, password: false });

  next();
}

