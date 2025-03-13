import { Router } from "express";
import * as productoController from "../controllers/producto.controller";
import { verificarAdmin } from "../middlewares/verificarAdmin";
import { verificarToken } from "../middlewares/jwt";
import upload from "../middlewares/multer";

const router = Router();

// crear Productos
router.post("/", upload.single('imagen'), verificarToken, verificarAdmin, productoController.create);
// Leer Productos
router.get("/", productoController.index);
// Leer Producto
router.get("/:id", productoController.leerByID);
// Editar Producto por ID
router.put("/:id", verificarToken, verificarAdmin, productoController.update);
// Eliminar Categoria por ID
router.delete("/:id", verificarToken, verificarAdmin, productoController.destroy);

export default router;