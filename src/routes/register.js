import express from 'express'

import models from '../models/index'
import { encryptPassword, ServerError } from '../utils'
const { User } = models

const router = express.Router()

router.route('/')
  .post(async (req, res, next) => {
    try {
      const { name, email, password } = req.user;

      if (!name) {
        throw new ServerError('Name is required', 400);
      }

      if (!email) {
        throw new ServerError('Email is required', 400);
      }

      if (!password) {
        throw new ServerError('Password is required', 400);
      }

      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new ServerError('User already exists', 409);
      }

      const hashedPassword = await encryptPassword(password);

      const newUser = await User.create({ name, email, hashedPassword });

      res.json(newUser);
    }
    catch (err) {
      next(err);
    }
  });

export default router;
