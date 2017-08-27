import usersRouter from './users';

export default (app) => {
  app.use('/users', usersRouter);
}
