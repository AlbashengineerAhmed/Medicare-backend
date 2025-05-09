import morgan from 'morgan';
import logger from '../utils/logger.js';

// Create a stream for morgan to write to
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Morgan format
const format = process.env.NODE_ENV === 'production'
  ? 'combined'
  : 'dev';

// Create morgan middleware
const morganMiddleware = morgan(format, { stream });

export default morganMiddleware;
