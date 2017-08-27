import passport from 'passport';
import { Strategy } from 'passport-local';
import models from '../../models';
import { isValidPassword } from '../../utils/crypt'

const { User, UserCredential, Company } = models;

const cfg = {
  usernameField: 'email',
};

passport.use(new Strategy(cfg, (email, password, cb) => {
  User.findOne({
    where: { email },
    include: [
      {
        model: Company,
        as: 'company'
      },
      {
        model: UserCredential,
        as: 'credentials'
      },
    ]
  })
  .then(async _user => {
    if (!_user) { return cb(null, false); }
    const user = JSON.parse(JSON.stringify(_user));

    if (!user.credentials) { return cb(null, false); }

    const { hashedPassword, salt, algorithm } = user.credentials;
    const isValid = isValidPassword(hashedPassword, password, salt, algorithm);

    if (!isValid) {
      return cb(null, false);
    }

    delete user.credentials

    return cb(null, user);
  })
  .catch(err => cb(err));
}));
