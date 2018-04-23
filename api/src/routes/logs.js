import express from 'express';
import fs from 'fs';
import { ServerError } from '../utils';
import { Log, Device, } from '../models/index';
import { s3, } from '../config';

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const logs = await Log.find()
        .populate('device')
        .sort('-createdAt')
        .limit(100)
        .exec();

      res.json(logs);
    }
    catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { loc } = req.body;

      if (!loc) {
        throw new ServerError('Location is required as loc', 400);
      }

      if (typeof loc !== 'object' || !loc.coordinates) {
        throw new ServerError('Location is required as loc as object with type and coordinates', 400);
      }

      if (!Array.isArray(loc.coordinates)
        || isNaN(+loc.coordinates[0])
        || isNaN(+loc.coordinates[1])) {
        throw new ServerError('Loc should have array of longitude and latitude [lon, lat]', 400);
      }

      const log = await Log.create(req.body);
      res.json(log);
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
