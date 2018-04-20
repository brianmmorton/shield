import logsRouter from './logs';
import devicesRouter from './devices';
import authRouter from './auth';

import { isAuthenticated } from '../utils';

export default (app) => {
  app.use('/auth', authRouter);
  app.use('/logs', logsRouter);
  app.use('/devices', devicesRouter);
}
