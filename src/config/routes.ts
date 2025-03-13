import usuariosRoutes from "../routes/usuarios.routes";
import categoriasRoutes from "../routes/categorias.routes";
import productosRoutes from "../routes/productos.routes"
import logger from "../utils/logger";

export const register = async (app: any) => {
  const url_base = '/api/v1';

  app.use(`${url_base}/usuarios`, usuariosRoutes);
  app.use(`${url_base}/categorias`, categoriasRoutes);
  app.use(`${url_base}/productos`, productosRoutes);
  //app.use(`${url_base}/carrito`, carritoRoutes);
  logger.info("🟢 Routes registered");
};