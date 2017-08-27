import passport from 'passport';
import { Strategy } from 'passport-local';
import models from '../../models';
import { isValidPassword } from '../../utils/crypt'

const { User } = models;

const cfg = {
  usernameField: 'email',
};

passport.use(new Strategy(cfg, (email, password, cb) => {
  User.findOne({
    where: { email },
  })
  .then(async _user => {
    if (!_user) { return cb(null, false); }
    const user = JSON.parse(JSON.stringify(_user));

    const { hashedPassword } = user;
    const isValid = isValidPassword(hashedPassword, password);

    if (!isValid) {
      return cb(null, false);
    }

    return cb(null, user);
  })
  .catch(err => cb(err));
}));
