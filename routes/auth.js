const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post(
  "/",
  [
    check("email", "El email es inavlido").isEmail(),
    check("password", "El password es inavlido").not().isEmpty(),
  ],
  authController.autenticarUsuario
);

router.get("/", auth, authController.usuarioAutenticado);

module.exports = router;
