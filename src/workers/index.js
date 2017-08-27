import kue from 'kue';
import Worker from './worker';
import example from './example';
import models from '../models';

const { User } = models;

/*
  Init queue
*/
export const queue = kue.createQueue({
  redis: process.env.REDIS_URL || 'redis://localhost:6379'
});

process.once('SIGTERM', () => {
  // wait 5000 ms to shutdown for any jobs working actively
  queue.shutdown(5000, err => {
    console.log('Kue shutdown: ', err || '');
    process.exit(0);
  });
});

export const exampleWorker = new Worker(queue, {
  perform: example,
  name: 'example',
  tab: '* * * * *',
  enqueue: (cb) => User.findAll().then(users => users.forEach(cb));
});

export default [
  exampleWorker,
];
