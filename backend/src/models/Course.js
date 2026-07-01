const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    level: { type: String, required: true, trim: true, maxlength: 80 },
    duration: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    isPublished: { type: Boolean, default: true },
    learningPath: [{ type: String, trim: true, maxlength: 100 }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
