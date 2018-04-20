export const IS_PROD = process.env.NODE_ENV === 'production';

export const PORT = process.env.PORT || 3000

export const ENVIRONMENT_URL = IS_PROD
  ? 'https://logger.shield.ai'
  : 'http://localhost:3030'

export const JSON_WBT_SECRET = IS_PROD
  ? process.env.JSON_WBT_SECRET
  : 'XXXXXXXX'

export const PRIVATE_SESSION_KEY = IS_PROD
  ? process.env.PRIVATE_SESSION_KEY
  : 'XXXXXXXX'

export const DB_URL = IS_PROD
  ? process.env.DB_URL
  : 'mongodb://localhost/shield'
