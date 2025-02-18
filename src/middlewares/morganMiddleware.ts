import morgan from 'morgan';
import logger from '../logger/logger';

// note: Morgan log “après” la réponse (c'est normal)

// todo: voir ce qu'il peut être utile de logger : https://www.npmjs.com/package/morgan#tokens
export const morganMiddleware = morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms', {
  stream: {
    // Configure Morgan to use our custom logger with the http severity
    write: (message: string) => logger.http(message.trim()),
  },
});

export default morganMiddleware;
