import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { TOKEN_EXPIRATION, JSON_WBT_SECRET } from '../config'

const router = express.Router()

router.route('/login')
  .post(
    passport.authenticate('local'),
    // passed authentication
    (req, res, next) => {
      const token = jwt.sign(req.user, JSON_WBT_SECRET, {
        expiresIn: TOKEN_EXPIRATION
      });

      res.json({ user: req.user, token });
    }
  );

router.route('/logout')
  .get(async (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
  });

export default router
