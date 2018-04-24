import express from 'express';
import moment from 'moment';
import fs from 'fs';
import { ServerError } from '../utils';
import { encryptPassword } from '../utils/crypt';
import { User, Log, Device, } from '../models/index';
import { s3, } from '../config';

const router = express.Router();

// User.create({
//   email: 'brianmmorton@gmail.com',
//   hashedPassword: encryptPassword('shield'),
// })

// only need to validate location here, others are handled by mongoose schema
function validateLogs (req, res, next) {
  try {
    const logs = Array.isArray(req.body) ? req.body : [req.body];

    for (const log of logs) {

      if (!log.loc) {
        throw new ServerError('Location is required as loc', 400);
      }

      if (typeof log.loc !== 'object' || !log.loc.coordinates) {
        throw new ServerError('Location is required as loc as object with type and coordinates', 400);
      }

      if (!Array.isArray(log.loc.coordinates)
        || isNaN(+log.loc.coordinates[0])
        || isNaN(+log.loc.coordinates[1])) {
        throw new ServerError('Loc should have array of longitude and latitude [lon, lat]', 400);
      }
    }

    next();
  }
  catch (err) {
    next(err);
  }
}

router.route('/')
  .get(async (req, res, next) => {
    try {
      const { start, end, max_duration, min_duration, generation, type } = req.query;
      const where = {};
      const whereDevice = {};

      if (start) {
        const _start = moment(start);
        if (!_start.isValid()) {
          throw new ServerError('Invalid start date', 400);
        }
        where.start = { $gte: moment(_start).utc().toDate(), };
      }

      if (end) {
        const _end = moment(end);
        if (!_end.isValid()) {
          throw new ServerError('Invalid end date', 400);
        }
        where.end = { $lte: moment(_end).utc().toDate(), };
      }

      if (min_duration) {
        where.duration = { $gte: Number(min_duration) * 60 };
        if (isNaN(where.duration.$gte)) {
          throw new ServerError('Invalid duration', 400);
        }
      }

      if (max_duration) {
        if (where.duration) where.duration['$lte'] = Number(max_duration) * 60;
        else where.duration = { $lte: Number(max_duration) * 60 };

        if (isNaN(where.duration.$lte)) {
          throw new ServerError('Invalid duration', 400);
        }
      }

      if (generation) {
        whereDevice.generation = { $in: [generation + ''] }
      }

      if (type) {
        whereDevice.type = { $in: [type] }
        if (!['drone'].includes(type)) {
          throw new ServerError('Invalid device type', 400);
        }
      }

      const count = await Log.count(where);

      if (count === 0) {
        return res.json([]);
      }

      const logs = await Log.find(where)
        .populate('device', null, whereDevice)
        .sort('-createdAt')
        .limit(100)
        .exec();

      res.json(logs);
    }
    catch (err) {
      next(err);
    }
  })
  .post(validateLogs, async (req, res, next) => {
    try {
      if (Array.isArray(req.body)) {
        const logs = await Log.insertMany(req.body);
        res.json(logs);
      }
      else {
        const log = await Log.create(req.body);
        res.json(log)
      };
    }
    catch (err) {
      next(err);
    }
  });

router.route('/:log_id/attachments')
  .post(
    (req, res, next) => {
      const { filename } = req.query;

      if (!filename) {
        throw new ServerError('File name is required in params as "filename"', 400)
      }

      req.pipe(fs.createWriteStream('/tmp/' + filename));
      req.on('end', () => {
        const contentComplete = +req.headers['content-range'].split('/')[0].split('-')[1];
        const contentLength = +req.headers['content-range'].split('/')[1];

        if (contentLength === contentComplete) {
          next();
        }
        else {
          res.status(200).send('Uploaded chunk')
        }
      });
    },
    async (req, res, next) => {
      try {
        const { filename } = req.query;
        const { log_id } = req.params;

        const log = await Log.findOne({ _id: log_id }).exec();

        if (!log) {
          throw new ServerError('Log not found', 404);
        }

        try {
          const uploadFileRes = await new Promise((resolve, reject) => {
            s3.upload({
              Key: filename,
              Bucket: `shield.ai/devices/${log.device}/logs/${log._id}`,
              ACL: 'public-read',
              Body: fs.createReadStream('/tmp/' + filename),
              ContentType: 'application/octet-stream',
            })
            .send((e, r) => {
              if (e) reject(e);
              else resolve(r);
            });
          });

          log.attachments.push({
            url: uploadFileRes.Location,
            key: uploadFileRes.Key,
            filename: filename,
            type: filename.split('.').pop(),
          });

          await log.save();
        }
        catch (err) {
          console.log(err);
          throw new ServerError(`Unknown error uploading file to s3`, 500);
        }

        res.json(log);
      }
      catch (err) {
        next(err);
      }
    })

export default router;
