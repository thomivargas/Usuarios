import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { validateLogin, validateNewPassword, validateRegister } from "../middlewares/validacion";
import { verificarToken } from "../middlewares/jwt";

const router = Router();

// Register
router.post("/register", validateRegister, userController.register);
// Validar email
router.get("/validate-email/:token", userController.validacion);
// reenvio de email para validar
router.post("/reenvio/email", userController.enviarEmail);


// envio de email para cambiar password
router.post('/reset', userController.reset)
// cambiar password
router.post('/new-password', validateNewPassword, userController.resetPassword);


// Login
router.post("/login", validateLogin, userController.login);
// refresh token
router.post("/refresh-token", userController.refreshToken);


//Perfil
router.get("/perfil", verificarToken, userController.Perfil);
// OBTENER TODOS
router.get("/", userController.index);
// ELIMINAR USUARIO
router.delete("/:id", userController.destroy);

export default router;