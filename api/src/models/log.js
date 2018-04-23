import mongoose from 'mongoose';
import uuid from 'uuid';
import moment from 'moment';
import timeZone from 'mongoose-timezone';

const Log = new mongoose.Schema({
  start: {
    type: Date,
    validate: {
      validator: v => moment(v).isValid(),
      message: 'Start date is not a valid date',
    },
    required: [true, 'Start date required']
  },
  end: {
    type: Date,
    validate: {
      validator: v => moment(v).isValid(),
      message: 'End date is not a valid date',
    },
    required: [true, 'End date required'],
  },
  device: {
    type: String,
    required: [true, 'Device id is required'],
    ref: 'Device',
  },
  createdAt: {
    type: Date,
    required: [true, 'createdAt is required'],
    default: Date.now,
  },
  loc: {
    type: { type: String },
    coordinates: [Number],
  },
  attachments: [
    {
      type: { type: String, },
      filename: String,
      key: String,
      url: String,
    },
  ],
});

Log.index({ loc: '2dsphere' });
Log.plugin(timeZone);

export default mongoose.model('Log', Log);
