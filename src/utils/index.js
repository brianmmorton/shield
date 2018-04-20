import passport from 'passport';
import { ValidationError } from 'express-validator';

export async function errorHandler (error, req, res) {
  console.error(' *** ERROR *** ', error)
  if (error && error.errors) {
    res.status(400).json(error.errors);
  }
  else if (error instanceof ServerError) {
    res.status(error.code).send(error.err);
  }
  else if (error.message) {
    res.status(500).send(error.message);
  }
  else if (typeof error === 'string') {
    res.status(500).send(error);
  }
  else {
    res.status(500).send('Unknown server error occurred');
  }
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
