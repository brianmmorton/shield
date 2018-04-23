import workers from './index';

Promise.all(workers.map(worker => worker.startScheduler()))
  .then(() => {
    console.log(`>>> Scheduler successfully started`);
  })
  .catch(err => {
    throw err;
  });
