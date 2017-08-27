import { CronJob } from 'cron';
import { client } from '../config/redis';

export default class Worker {

  constructor (kue, cfg) {

    if (!cfg.name) {
      throw new Error("Worker requires a name");
    }
    if (!cfg.perform) {
      throw new Error("Worker requires a function to perform");
    }

    this.kue = kue;
    this.tab = cfg.tab;
    this.name = cfg.name;
    this.perform = cfg.perform;
    this.preHook = cfg.preHook;
    this.enqueueJob = cfg.enqueueJob;
  }

  performJob (job, io, done) {
    this.perform(job, io)
      .then(() => {
        job.log(`Finished job...`);

        let socket = null;
        try {
          socket = JSON.parse(job.data.body).socket;
        }
        catch (e) {
          socket = job.data.body;
        }
        finally {
          if (socket) {
            console.log('Emitting success message to socket: ', socket);
            io.to(socket).emit(this.name, 'job-completed');
          }
        }

        done();
      }, err => {
        job.log(err);

        let socket = null;
        try {
          socket = JSON.parse(job.data.body).socket;
        }
        catch (e) {
          socket = job.data.body;
        }
        finally {
          if (socket) {
            console.log('Emitting success message to socket: ', socket);
            io.to(socket).emit(this.name, 'job-completed');
          }
        }

        done(err);
        console.log(err);
      })
  }

  run () {
    if (!this.enqueueJob) {
      return this.enqueue();
    }

    return this.enqueueJob(::this.enqueue);
  }

  enqueue (meta = '') {
    console.log(`Enqueueing job for ${this.name}, ${JSON.stringify(meta)}`);
    this.kue
      .create(this.name, { title: `${this.name} for ${JSON.stringify(meta)}`, body: meta })
      .unique('body')
      .removeOnComplete(true)
      .save();
  }

  startScheduler () {
    // the scheduler will run the job every tab time, then send a message to the queue
    if (this.tab) {
      if (this.tab instanceof Number) {
        setInterval(() => this.run(), this.tab * 60 * 1000);
        console.log(`${this.name} set to run every ${this.tab} minutes`);
      }
      else {
        try {
          (new CronJob({ // eslint-disable-line
            cronTime: this.tab,
            onTick: () => {
              this.run()
            },
          })).start();
          console.log(`${this.name} set to run with tab ${this.tab}`);
        }
        catch (err) {
          throw new Error('Invalid cron tab pattern');
        }
      }
    }

    return this;
  }

  startProcessor () {
    const io = require('socket.io-emitter')(client);

    console.log(`Listening for jobs in ${this.name}`);
    this.kue.process(this.name, 1, (job, done) => {
      try {
        // extend the job log utility to also write to console
        job._log = job.log;
        job.log = (str) => {
          console.log(this.name + ': ' + str);
          job._log(str);
        }

        console.log(`>>> Starting job ${this.name}...`);
        if (this.preHook) {
          return this.preHook(job)
            .then(j => this.performJob(j, io, done), err => {
              console.log(err);
              done(err)
            });
        }

        return this.performJob(job, io, done);
      }
      catch (err) {
        done(err)
      }
    });

    return this;
  }
}
