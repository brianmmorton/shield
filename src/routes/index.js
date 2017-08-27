import usersRouter from './users';
import authRouter from './auth';

import { isAuthenticated } from '../utils';

export default (app) => {
  app.use('/auth', authRouter);
  app.use('/users', isAuthenticated, usersRouter);
}
