import mongoose from 'mongoose';
import timeZone from 'mongoose-timezone';

const Device = new mongoose.Schema({
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
