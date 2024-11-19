"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = app_1.default;
app.listen(app.get('port'), () => {
    logger_1.default.info(`🟢 App listening on the port ${app.get('port')}`);
});
