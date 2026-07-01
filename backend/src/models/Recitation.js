const mongoose = require('mongoose');

const recitationSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    note: { type: String, trim: true, maxlength: 1200 },
    audioUrl: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ['SUBMITTED', 'REVIEWED'], default: 'SUBMITTED', index: true },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recitation', recitationSchema);
