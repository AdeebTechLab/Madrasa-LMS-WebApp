const mongoose = require('mongoose');

const juzProgressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    juzNumber: { type: Number, required: true, min: 1, max: 30 },
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
    masteryStatus: { type: String, enum: ['NOT_STARTED', 'IN_PROGRESS', 'MASTERED'], default: 'NOT_STARTED' }
  },
  { timestamps: true }
);

juzProgressSchema.index({ student: 1, juzNumber: 1 }, { unique: true });

module.exports = mongoose.model('JuzProgress', juzProgressSchema);
