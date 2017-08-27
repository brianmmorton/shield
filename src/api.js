import 'moment-duration-format';
// parse big int for sequelize
require('pg').defaults.parseInt8 = true

import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import helmet from 'helmet'
import session from 'express-session';
import passport from 'passport';
import morgan from 'morgan';
import pg from 'pg';
import cluster from 'cluster';
const pgSession = require('connect-pg-simple')(session);

import bootstrapApiRoutes from './routes/index'
import { JSON_WBT_SECRET, IS_PROD } from './config'
import { errorHandler } from './utils'

import dbModels from './models/index'
import { MAIN_DB_URL } from './config/db'
import './config/passport'


require('moment-range');
// allows sequelize to parse decimal and floats to javascript floats
require('pg-parse-float')(pg);

const numCPUs = process.env.WEB_CONCURRENCY || 1;
const redisUri = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const tortoise = new Tortoise(RABBITMQ_BIGWIG_RX_URL);

console.log(`Registered ${numCPUs} cpus. Starting servers...`);

if (cluster.isMaster) {
  console.log('Starting master server (listening in fork)');
  const server = require('http').createServer();
  const io = require('socket.io').listen(server);
  const redis = require('socket.io-redis');

  io.adapter(redis(redisUri));

  for (let i = 0; i < numCPUs; i++) {
    console.log('Forking...');
    cluster.fork();
  }

  cluster.on('exit', worker => {
    console.log('worker ' + worker.process.pid + ' died');
  });
}
else {
  console.log('Starting main server, request handler');
  startApp();
}

async function startApp () {

  const app = express();
  const server = http.createServer(app);

  const io = require('socket.io').listen(server);
  const redis = require('socket.io-redis');

  io.adapter(redis(redisUri));
  io.on('connection', socket => {
    console.log(`Connected to client: ${socket.id}`);
  });

  app.set('port', process.env.PORT || 3030);

  /* Socket io to use throughout the routers */
  app.use((req, res, next) => {
    res.io = io;
    next();
  });

  /* SSL */
  app.get('*', (req, res, next) => {
    if (IS_PROD && req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect('https://api.allocate.ai' + req.url)
    }
    else {
      next();
    }
  });

  /* rendering middleware */
  app.use(helmet())
  app.use(morgan('dev'))

  /* For json webtoken authentication */
  app.set('JSON_WBT_SECRET', JSON_WBT_SECRET);

  /* Assuming well need this for post from activity monitor -- TEST */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
    next()
  });

  /* body parsing middleware */
  app.use(require('cookie-parser')())
  app.use(bodyParser.json({ limit: '2mb' }))
  app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }))

  /* authentication. make sure express-session comes first */
  app.use(session({
    store: new pgSession({
      pg: pg,
      conString: MAIN_DB_URL,
      tableName: 'user_sessions',
    }),
    secret: PRIVATE_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 12 * 30 * 24 * 60 * 60 * 1000 } // 1 year
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  console.log('Syncing the databases...');
  /* bootstrap the databases */
  const startMainDb = dbModels.main.sequelize.sync()
  const startActivitiesDb = dbModels.activities.sequelize.sync()

  // inititalize the workers so that they can send messages to the
  // worker processes
  const [mainDb, activitiesDb] = await Promise.all([startMainDb, startActivitiesDb]);

  console.log('Databases synced...');
  /* add in api routes */
  bootstrapApiRoutes(app, activitiesDb, mainDb)

  app.use((err, req, res, next) => {
    if (err) {
      return errorHandler(err, req, res, next);
    }
    next();
  });

  console.log('Starting listen');
  server.listen(app.get('port'), err => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', process.env.PORT || 3030);
  });
}
