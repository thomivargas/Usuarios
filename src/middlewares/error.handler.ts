import logger from "../utils/logger";

const errorHandler = (err: any, req: any, res: any, next: any
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`Error ${status} - ${message}`);

  return res.status(status).json({
    status,
    message,
  });
};
export default errorHandler;