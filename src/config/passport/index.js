import passport from 'passport';
import models from '../../models';

const { User } = models;

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({
    where: { id },
  })
  .then(user => cb(null, JSON.parse(JSON.stringify(user))))
  .catch(err => cb(err));
});

import './jwt';
import './local';
