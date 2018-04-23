import mongoose from 'mongoose';
import uuid from 'uuid';
import timeZone from 'mongoose-timezone';

const User = new mongoose.Schema({
  _id: { type: String, default: uuid.v1, required: true, },
  createdAt: { type : Date, default : Date.now, required: true, },
  email: { type: String, required: [true, 'Email is required'], },
  hashedPassword: { type: String, required: [true, 'Password is required'], },
});

User.plugin(timeZone);

export default mongoose.model('User', User);
