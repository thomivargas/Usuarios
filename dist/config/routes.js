"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const usuarios_routes_1 = __importDefault(require("../routes/usuarios.routes"));
const logger_1 = __importDefault(require("../utils/logger"));
const register = async (app) => {
    //app.use('/product', productRoutes);
    app.use('/usuarios', usuarios_routes_1.default);
    logger_1.default.info("🟢 Routes registered");
};
exports.register = register;
