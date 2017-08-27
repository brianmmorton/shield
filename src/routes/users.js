import express from 'express'

import models from '../../models/index'
const { User } = models

const router = express.Router()

router.route('/')
  .get(async (req, res, next) => {
    try {
      const user = req.user;
      res.json(user);
    }
    catch (err) {
      next(err);
    }
  });

export default router;
