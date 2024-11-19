import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { validateLogin, validateRegister } from "../middlewares/validacion";
import { verificarToken } from "../middlewares/jwt";

const router = Router();

// Register
router.post("/register", validateRegister, userController.register);
// Login
router.post("/login", validateLogin, userController.login);
// Validar email
router.post("/validate-email/:token", userController.validacion);
//Perfil
router.get("/perfil", verificarToken, userController.Perfil)



// OBTENER TODOS
router.get("/", userController.index);
// EDITAR USUARIO
//router.put("/:id", userController.update);
// ELIMINAR USUARIO
router.delete("/:id", userController.destroy);

export default router;