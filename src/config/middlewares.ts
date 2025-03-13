import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import logger from "../utils/logger";

export const configure = async (app: Application) => {
  dotenv.config();
  app.use(
    morgan("dev", {
      stream: {
        write: (message: string) => {
          logger.info(message.trim()); // Esto registrará cada solicitud HTTP en tu logger.
        },
      },
    })
  );
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  logger.info("🟢 Middlewares configurated");
};