const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: false },
  email: { type: String, unique: true, required: true },
  phone: { type: Number, unique: true, required: true },
  role: { type: String, enum: ['User', 'Driver', 'Admin'], default: 'User' },
  vehicleType: String,
  vehicleNumber: String,
  licenseNumber: String,
  otp: String,
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
