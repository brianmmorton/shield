import passport from 'passport';
import { User } from '../../models';

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err || !user) { return cb(err || null, false); }

    return cb(null, JSON.parse(JSON.stringify(user)));
  })
});

import './jwt';
