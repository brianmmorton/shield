import passport from 'passport';
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
import { JSON_WBT_SECRET } from '../index';
import models from '../../models';

const { User } = models;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: JSON_WBT_SECRET,
}

passport.use(new JwtStrategy(opts, (jwt_payload, cb) => {
  return User.findOne({ where: { id: jwt_payload.id }})
    .then(user => {
      if (!user) { return cb(null, false); }

      return cb(null, user);
    })
    .catch(err => cb(err));
}));
