const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, unique: true, required: true, maxlength: 160 },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['ADMIN', 'TEACHER', 'STUDENT'], default: 'STUDENT', index: true },
    isActive: { type: Boolean, default: true },
    currentJuz: { type: Number, min: 1, max: 30, default: 1 },
    phone: { type: String, trim: true, maxlength: 40 }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    currentJuz: this.currentJuz,
    isActive: this.isActive
  };
};

module.exports = mongoose.model('User', userSchema);
