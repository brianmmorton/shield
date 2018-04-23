import mongoose from 'mongoose';
import uuid from 'uuid';
import timeZone from 'mongoose-timezone';

const Device = new mongoose.Schema({
  _id: { type: String, default: uuid.v1, required: true, },
  generation: { type: Number, required: [true, 'Device generation is required'], },
  createdAt: { type : Date, default : Date.now, required: true, },
  type: {
    type: String,
    required: true,
    enum: ['drone'],
    default: 'drone',
  },
});

Device.plugin(timeZone);

export default mongoose.model('Device', Device);
