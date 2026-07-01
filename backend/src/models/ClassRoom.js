const mongoose = require('mongoose');

const classRoomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    scheduleDays: { type: String, trim: true, default: 'Monday to Friday' },
    startTime: { type: String, trim: true, default: '08:00' },
    endTime: { type: String, trim: true, default: '09:00' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClassRoom', classRoomSchema);
