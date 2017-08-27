import passport from 'passport';
import models from '../../models';
import { Strategy as LinkedInStrategy } from 'passport-linkedin';
import { LINKEDIN_CLIENT_ID, LINKEDIN_SECRET_KEY, ENVIRONMENT_URL } from '../index';

const { User } = models;

const cfg = {
  consumerKey: LINKEDIN_CLIENT_ID,
  consumerSecret: LINKEDIN_SECRET_KEY,
  callbackURL: `${ENVIRONMENT_URL}/auth/linkedin/callback`,
  scope: ['r_emailaddress', 'r_basicprofile'],
  profileFields: ['id', 'first-name', 'last-name', 'email-address', 'picture-url', 'public-profile-url'],
  passReqToCallback: true // ensures that the post data with the company_id and user_role_id is sent through
};

passport.use(new LinkedInStrategy(cfg, function (req, token, tokenSecret, profile, cb) {
  User.findOne({
    where: { provider: { id: profile.id, provider: profile.provider } },
    raw: true
  })
  .then(user => {
    if (!user) {
      return User.create({
        company_id: req.body.company_id,
        user_role_id: 1,
        provider: 'linkedin',
        name: profile.displayName,
        email: profile.emails[0].value,
        position: 'Unknown',
        avatarUrl: profile._json.pictureUrl || null,
      })
      .then(newUser => {
        let user = newUser.dataValues;
        delete user.hashedPassword;
        delete user.salt;

        cb(null, user);
      });
    }

    // if (!isValidPassword(user.hashedPassword, password, user.salt)) {
    //   return cb(null, false);
    // }

    delete user.hashedPassword;
    delete user.salt;

    return cb(null, user);
  })
  .catch(err => cb(err));
}));
