import AWS from 'aws-sdk';
import path from 'path';

export const IS_PROD = process.env.NODE_ENV === 'production';

if (!IS_PROD) {
  require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
}

export const PORT = process.env.PORT || 3000

AWS.config.update({
  region: 'us-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

export const s3 = new AWS.S3();
