import express from 'express';
import { ServerError } from '../utils';
import { User, } from '../models/index';

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      res.json(req.user);
    }
    catch (err) {
      next(err);
    }
  });

export default router;
