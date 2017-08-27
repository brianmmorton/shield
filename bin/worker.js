#!/usr/bin/env node

const cluster = require('cluster');
const numCPUs = process.env.WEB_CONCURRENCY || 1;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
else {
  require('../server.babel');
  require('../src/workers/run');

  console.log(`Worker ${process.pid} started`);
}
