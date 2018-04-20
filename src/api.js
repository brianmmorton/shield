import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import helmet from 'helmet';
import passport from 'passport';
import morgan from 'morgan';
import mongoose from 'mongoose';

mongoose.Promise = require('bluebird');

import bootstrapApiRoutes from './routes/index';
import { errorHandler } from './utils';
import { DB_URL } from './config';

const app = express();

app.set('port', process.env.PORT || 3030);

/* rendering middleware */
app.use(helmet())
app.use(morgan('dev'))

/* body parsing middleware */
app.use(require('cookie-parser')())
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }))

app.use(passport.initialize());
app.use(passport.session());

/* add in api routes */
bootstrapApiRoutes(app);

app.use((err, req, res, next) => {
  if (err) {
    return errorHandler(err, req, res, next);
  }
  next();
});


mongoose.connect(DB_URL, {
  autoReconnect: true,
})
.then(() => listen(), err => console.log(err));

function listen () {
  app.listen(app.get('port'), err => {
    if (err) {
      throw err;
    }
    console.info('----\n==> 🌎  API is running on port %s', app.get('port'));
  });
}
