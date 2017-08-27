export const IS_PROD = process.env.NODE_ENV === 'production';
export const localConfig = IS_PROD ? {} : require('../../../.local-config'); // keep in .gitignore

export const PORT = process.env.PORT || 3000

export const ENVIRONMENT_URL = IS_PROD
  ? 'https://yourproductionurl.com'
  : 'http://localhost:3030'

export const JSON_WBT_SECRET = IS_PROD
  ? process.env.JSON_WBT_SECRET
  : 'devsecret'

export const PRIVATE_SESSION_KEY = IS_PROD
  ? process.env.PRIVATE_SESSION_KEY
  : localConfig.PRIVATE_SESSION_KEY

export const DB_URL = IS_PROD
  ? process.env.DB_URL
  : localConfig.DB_URL
