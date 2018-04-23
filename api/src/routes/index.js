import logsRouter from './logs';
import devicesRouter from './devices';
import authRouter from './auth';
import usersRouter from './users';

import { isAuthenticated } from '../utils';

export default (app) => {
  app.use('/auth', authRouter);
  app.use('/users', isAuthenticated, usersRouter);
  app.use('/logs', isAuthenticated, logsRouter);
  app.use('/devices', isAuthenticated, devicesRouter);
}