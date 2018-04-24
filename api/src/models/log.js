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
  duration: {
    type: Number,
    validate: {
      validator: d => !isNaN(Number(d)),
      message: 'Duration must be a number',
    },
    required: [true, 'Duration is required'],
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
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

Log.pre('validate', function (next) {
  if (!this.duration) {
    this.duration = Math.abs(moment(this.start).diff(moment(this.end), 'seconds'));
  }
  next()
})

Log.pre('save', function (next) {
  if (!this.duration) {
    this.duration = Math.abs(moment(this.start).diff(moment(this.end), 'seconds'));
  }
  if (!(this.start instanceof Date)) {
    this.start = new Date(this.start);
  }
  if (!(this.end instanceof Date)) {
    this.end = new Date(this.end);
  }
  next()
})

export default mongoose.model('Log', Log);
