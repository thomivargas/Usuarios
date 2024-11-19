import App from "./app";
import logger from "./utils/logger";
 
const app = App;
app.listen(app.get('port'), () => {
  logger.info(`🟢 App listening on the port ${app.get('port')}`);
});