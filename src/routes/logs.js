import express from 'express';
import { ServerError } from '../utils';
import { Log, Device, } from '../models/index';

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const logs = await Log.find().sort('-createdAt').limit(100).exec();

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

      const device = await Device.findById(req.body.device_id).exec();

      if (!device) {
        throw new ServerError('Device not found, you can insert one via POST /devices', 404);
      }

      const log = await Log.create(req.body);
      res.json(log);
    }
    catch (err) {
      next(err);
    }
  });

export default router;
