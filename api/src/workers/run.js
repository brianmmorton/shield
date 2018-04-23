import workers, { queue } from './index';
import kue from 'kue';
import moment from 'moment';

/*
  Putting this here now until we have the resources
  to use a separate process to schedule jobs
*/
import './scheduler';

Promise.all(workers.map(worker => worker.startProcessor()))
  .then(() => {
    console.log(`>>> Workers successfully started`);
  })
  .catch(err => {
    throw err;
  });

queue.watchStuckJobs(2000);

/*
  Reset jobs to inactive in case they got stuck when shutting down the process
*/
queue.active(function (err, ids) {
  ids.forEach(function (id ) {
    kue.Job.get(id, function (err, job) {
      console.log(`Reseting ${id} to inactive...`);
      // Your application should check if job is a stuck one
      job.inactive();
    });
  });
});

/*
  Delete failed jobs at the start of the process
*/
queue.failed(function (err, ids) {
  ids.forEach(function (id ) {
    kue.Job.get(id, function (err, job) {
      console.log(`Deleting failed job ${id}...`);
      // Your application should check if job is a stuck one
      job.remove();
    });
  });
});

/*
  For some reason some jobs never get processed. So loop through the inactive
  jobs and if it has been more than 30 minutes inactive, then delete and re-enqueue it.
*/
setInterval(() => {
  console.log(`Performing inactive queue maintenance...`);
  queue.inactive(function (err, ids) {
    ids.forEach(function (id) {
      kue.Job.get(id, function (err, job) {
        const diff = moment().diff(moment.unix(+job.created_at / 1000), 'minute');
        if (diff > 30) {
          console.log(`Removing job ${job.type}, id: ${job.id}`);
          const { type, data } = job;

          job.remove(() => {
            queue.create(type, data)
              .unique('body')
              .removeOnComplete(true)
              .save();
          });
        }
      });
    });
  });
}, 1000 * 60 * 60);
