import bcrypt from 'bcrypt'

export function encryptPassword (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

export function isValidPassword (hashed_password, password) {
  return bcrypt.compareSync(password, hashed_password);
}
