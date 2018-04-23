import passport from 'passport';

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ _id: id }).exec()
    .then(user => cb(null, JSON.parse(JSON.stringify(user))))
    .catch(err => cb(err));
});

import './jwt';
