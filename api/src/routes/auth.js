import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { isEmail } from 'validator'
import { User } from '../models'
import { ServerError, } from '../utils'
import { isValidPassword, encryptPassword } from '../utils/crypt'

const router = express.Router()

router.route('/login')
  .post(async (req, res, next) => {
    try {
      const { email, password, } = req.body;

      if (!email) {
        throw new ServerError('Email is required', 400)
      }

      if (!password) {
        throw new ServerError('Password is required', 400)
      }

      if (!isEmail(email)) {
        throw new ServerError('Invalid email', 400)
      }

      const count = await User.count();

      if (count === 0) {
        throw new ServerError('User not found', 404);
      }

      const user = await User.findOne({ email, }).exec();

      if (!user) {
        throw new ServerError('User not found', 404)
      }

      if (!isValidPassword(user.hashedPassword, password)) {
        throw new ServerError('Invalid password', 400)
      }

      const _user = JSON.parse(JSON.stringify(user));

      delete _user.hashedPassword;

      const token = jwt.sign(_user, 'xxx', {
        expiresIn: 60 * 60 * 24 * 60,
      });

      res.json({ user: _user, token });
    }
    catch (err) {
      next(err);
    }
  });

router.route('/logout')
  .get(async (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.status(200).send();
  });

export default router
