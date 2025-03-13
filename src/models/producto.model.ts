import { pool } from '../config/database'
import logger from '../utils/logger';

interface Producto {
    nombre: string,
    descripcion: Text,
    precio: number,
    imagen_url: string
}

// Crear Producto
export const crear = async (producto: Producto) => {
  try {
    const result = await pool.query(
      'INSERT INTO productos (p_nombre, p_descripcion, p_precio, p_imagen_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [producto.nombre, producto.descripcion, producto.precio, producto.imagen_url]
    );
    return result.rows[0];
  } catch (err) {
    logger.error(`🔴 MODAL - Error al crear producto - ${err}`)
    throw new Error('Error al crear producto');
  }
};

// Asignar Categoria al producto
export const tipo = async (nombre: string, id_categoria: string) => {
  try {
    const id_producto = await pool.query('SELECT id_producto FROM productos WHERE p_nombre = $1', [nombre]);
    const result = await pool.query(
      'INSERT INTO productos_categorias (id_categoria, id_producto) VALUES ($1, $2) RETURNING *',
      [id_categoria, id_producto.rows[0].id_producto]
    );
    return result.rows[0];
  } catch (err) {
    logger.error(`🔴 MODAL - Error al asignar categoria al producto - ${err}`)
    throw new Error(`Error al asignar categoria al producto - ${err}`);
  }
};

// Asignar stock al producto
export const stock = async (nombre: string, cantidad: number, tipo_movimiento: string) => {
  try {
    const id_producto = await pool.query('SELECT id_producto FROM productos WHERE p_nombre = $1', [nombre]);
    const result = await pool.query(
      'INSERT INTO movimientos_stock (id_producto, cantidad, tipo_movimiento) VALUES ($1, $2, $3) RETURNING *',
      [id_producto.rows[0].id_producto, cantidad, tipo_movimiento]
    );
    return result.rows[0];
  } catch (err) {
    logger.error(`🔴 MODAL - Error al asignar stock al producto - ${err}`)
    throw new Error(`Error al asignar stock al producto - ${err}`);
  }
};

// Obtener todas los productos
export const index = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_producto as ID,
        p.p_nombre as NOMBRE_PRODUCTO,
        p.p_descripcion as DESCRIPCION,
        p.p_precio as PRECIO,
        p.p_imagen_url as IMAGEN,
        c.nombre as CATEGORIA,
        s.cantidad as STOCK
        FROM productos p 
          INNER JOIN productos_categorias pc ON p.id_producto = pc.id_producto
          INNER JOIN categorias c ON c.id_categoria = pc.id_categoria
          INNER JOIN movimientos_stock s ON s.id_producto = p.id_producto
    `);
    return result.rows
  } catch (err) {
    logger.error(`🔴 MODAL - Error al obtener productos - ${err}`)
    throw new Error(`Error al obtener productos - ${err}`);
  }
};

// Obtener un solo producto
export const getProductoByID = async (id: string) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_producto as ID,
        p.p_nombre as NOMBRE_PRODUCTO,
        p.p_descripcion as DESCRIPCION,
        p.p_precio as PRECIO,
        p.p_imagen_url as IMAGEN,
        c.nombre as CATEGORIA,
        s.cantidad as STOCK
        FROM productos p 
          INNER JOIN productos_categorias pc ON p.id_producto = pc.id_producto
          INNER JOIN categorias c ON c.id_categoria = pc.id_categoria
          INNER JOIN movimientos_stock s ON s.id_producto = p.id_producto
        WHERE p.id_producto = $1
    `, [id]);
    return result.rows
  } catch (err) {
    logger.error(`🔴 MODAL - Error al obtener producto por ID - ${err}`)
    throw new Error(`Error al obtener producto por ID - ${err}`);
  }
};

// Editar una producto
export const editarProducto = async (
  id: string,
  campos: { 
    nombre?: string; 
    descripcion?: string; 
    precio?: number; 
    imagen_url?: string;
    cantidad?: string;
    categoria?: number;
  }
) => {
  try {
    const columnas: string[] = [];
    const valores: any[] = [id];

    if (campos.nombre) {
      columnas.push(`p_nombre = $${valores.length + 1}`);
      valores.push(campos.nombre);
    }
    if (campos.descripcion) {
      columnas.push(`p_descripcion = $${valores.length + 1}`);
      valores.push(campos.descripcion);
    }
    if (campos.precio) {
      columnas.push(`p_precio = $${valores.length + 1}`);
      valores.push(campos.precio);
    }
    if (campos.imagen_url) {
      columnas.push(`p_imagen_url = $${valores.length + 1}`);
      valores.push(campos.imagen_url);
    }
    if (campos.cantidad) {
      await pool.query('UPDATE movimientos_stock SET cantidad = $1 WHERE id_producto = $2', [campos.cantidad, id]);
    }
    if (campos.categoria) {
      await pool.query(`
        UPDATE categorias
        SET nombre = $1
        FROM productos_categorias
        WHERE categorias.id_categoria = productos_categorias.id_categoria
        AND productos_categorias.id_producto = $2;`, 
      [campos.categoria, id]);
    }
    if (campos.nombre || campos.descripcion || campos.precio || campos.imagen_url) {
      const consulta = `
        UPDATE productos 
        SET ${columnas.join(', ')}
        WHERE id_producto = $1 
        RETURNING *`;
      await pool.query(consulta, valores);
    }
    return {ok: true};
  } catch (err) {
    logger.error(`🔴 MODAL - Error al editar producto - ${err}`)
    throw new Error(`Error al editar producto - ${err}`);
  }
};

// Eliminar Producto
export const deleteProducto = async (id: string) => {
  try {
    const result = await pool.query('DELETE FROM productos WHERE id_producto = $1 RETURNING *', [id]);
    return result.rows.length ? result.rows[0] : null;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al eliminar Producto - ${err}`);
    throw new Error(`Error al eliminar Producto - ${err}`);
  }
};