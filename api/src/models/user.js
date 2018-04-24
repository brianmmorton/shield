import mongoose from 'mongoose';
import timeZone from 'mongoose-timezone';

const User = new mongoose.Schema({
  createdAt: { type : Date, default : Date.now, required: true, },
  email: { type: String, required: [true, 'Email is required'], },
  hashedPassword: { type: String, required: [true, 'Password is required'], },
});

User.plugin(timeZone);

export default mongoose.model('User', User);
