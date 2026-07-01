const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true, maxlength: 160 },
    reference: { type: String, trim: true, maxlength: 120 },
    content: { type: String, trim: true, maxlength: 1600 },
    audioUrl: { type: String, trim: true, maxlength: 500 }
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    classRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassRoom' },
    assignmentDate: { type: Date, default: Date.now, index: true },
    status: { type: String, enum: ['ASSIGNED', 'SUBMITTED', 'REVIEWED'], default: 'ASSIGNED' },
    sabaqLesson: { type: lessonSchema, required: true },
    sabqiLesson: { type: lessonSchema, required: true },
    manzilLesson: { type: lessonSchema, required: true },
    teacherNote: { type: String, trim: true, maxlength: 700 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
