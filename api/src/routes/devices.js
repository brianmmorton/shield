import express from 'express';
import { ServerError } from '../utils';
import { Device, } from '../models/index';

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const devices = await Device.find().sort('-createdAt').exec();

      res.json(devices);
    }
    catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const device = await Device.create(req.body);
      res.json(device);
    }
    catch (err) {
      next(err);
    }
  });

export default router;
