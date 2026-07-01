const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    recitation: { type: mongoose.Schema.Types.ObjectId, ref: 'Recitation' },
    textFeedback: { type: String, required: true, trim: true, maxlength: 1400 },
    tajweedNotes: { type: String, trim: true, maxlength: 900 },
    score: { type: Number, min: 0, max: 100 },
    voiceFeedbackUrl: { type: String, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
