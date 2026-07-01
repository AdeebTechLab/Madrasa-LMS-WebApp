const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, trim: true, required: true, maxlength: 100 },
    parentName: { type: String, trim: true, required: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, required: true, maxlength: 160 },
    phone: { type: String, trim: true, required: true, maxlength: 40 },
    courseInterest: { type: String, trim: true, required: true, maxlength: 100 },
    currentLevel: { type: String, trim: true, maxlength: 160 },
    message: { type: String, trim: true, maxlength: 1600 },
    status: { type: String, enum: ['PENDING', 'CONTACTED', 'APPROVED', 'DECLINED'], default: 'PENDING', index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admission', admissionSchema);
