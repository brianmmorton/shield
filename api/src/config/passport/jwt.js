import passport from 'passport';
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
import { User } from '../../models';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'xxx',
}

passport.use(new JwtStrategy(opts, (jwt_payload, cb) => {
  User.findById(jwt_payload._id, (err, user) => {
    if (err || !user) { return cb(err || null, false); }

    return cb(null, user);
  });
}));
