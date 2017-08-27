import passport from 'passport';
import models from '../models';
import { UniqueConstraintError } from 'sequelize';

const { ErrorLog } = models;

export async function errorHandler (error, req, res) {
  console.error(' *** ERROR *** ', error, error instanceof ServerError)
  if (error instanceof ServerError) {
    return res.status(error.code).send(error.err)
  }
  else if (error instanceof UniqueConstraintError) {
    return res.status(409).json({
      errors: error.errors,
    })
  }

  try {
    const text = error instanceof String ? error : JSON.stringify(error);
    const dbError = await ErrorLog.findOne({
      where: { text },
    });

    if (dbError) {
      await dbError.updateAttributes({
        text,
        date: new Date(),
        count: dbError.dataValues.count + 1,
        process: 'server',
        user_id: req.user ? req.user.id : null,
      });
    }
    else {
      await ErrorLog.create({
        text,
        date: new Date(),
        count: 1,
        process: 'server',
        user_id: req.user ? req.user.id : null,
      });
    }
  }
  catch (err) {
    console.log(err);
    // do nothing
  }

  if (typeof error === 'string') {
    return res.status(500).send(error)
  }

  return res.status(500).json(error)
}

export class ServerError {
  constructor (err, code) {
    this.err = err
    this.code = code
  }
}

export function isAuthenticated (req, res, next) {
  if (!req.isAuthenticated()) {
    return passport.authenticate('jwt')(req, res, next);
  }

  return next();
}
