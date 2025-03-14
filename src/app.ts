import express from "express"
import * as routes from "./config/routes";
import errorHandler from "./middlewares/error.handler";
import * as middlewares from "./config/middlewares";
import 'dotenv/config';

const app = express();

// Configura el middleware
middlewares.configure(app);

// Settings
app.set("port", process.env.PORT || 8080);

// Routes
routes.register(app);

// Error Handler
app.use(errorHandler);

export default app;