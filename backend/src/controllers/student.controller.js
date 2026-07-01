const Assignment = require('../models/Assignment');
const Feedback = require('../models/Feedback');
const JuzProgress = require('../models/JuzProgress');
const Recitation = require('../models/Recitation');
const asyncHandler = require('../utils/asyncHandler');
const { serializeDoc, serializeList } = require('../utils/serialize');

const getDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const [assignment, feedback, progress] = await Promise.all([
    Assignment.findOne({ student: studentId }).sort({ assignmentDate: -1, createdAt: -1 }).lean(),
    Feedback.find({ student: studentId }).populate('teacher', 'fullName').sort({ createdAt: -1 }).limit(5).lean(),
    JuzProgress.find({ student: studentId }).sort({ juzNumber: 1 }).lean()
  ]);

  const completeProgress = Array.from({ length: 30 }, (_, index) => {
    const existing = progress.find((item) => item.juzNumber === index + 1);
    return existing || { juzNumber: index + 1, completionPercentage: 0, masteryStatus: 'NOT_STARTED' };
  });

  res.json({
    student: req.user.toSafeJSON(),
    assignment: serializeDoc(assignment),
    feedback: serializeList(feedback),
    progress: serializeList(completeProgress),
    islamicReflection: {
      label: 'Daily Reflection',
      arabic: 'رَبِّ زِدْنِي عِلْمًا',
      translation: 'My Lord, increase me in knowledge.',
      reference: 'Quran 20:114',
      adab: 'Begin each revision session with Bismillah, calm attention, and sincere intention.'
    },
    prayerSchedule: [
      ['Fajr', '05:05'],
      ['Dhuhr', '12:30'],
      ['Asr', '16:45'],
      ['Maghrib', '19:20'],
      ['Isha', '20:45']
    ]
  });
});

const submitRecitation = asyncHandler(async (req, res) => {
  const { assignmentId, note, audioUrl } = req.body;
  if (!assignmentId) return res.status(400).json({ message: 'Please select an assignment before submitting.' });

  const assignment = await Assignment.findOne({ _id: assignmentId, student: req.user._id });
  if (!assignment) return res.status(404).json({ message: 'This assignment was not found for your account.' });

  const recitation = await Recitation.create({
    assignment: assignment._id,
    student: req.user._id,
    note: note || '',
    audioUrl: audioUrl || ''
  });

  assignment.status = 'SUBMITTED';
  await assignment.save();

  res.status(201).json({ message: 'Recitation submitted for teacher review.', recitation: serializeDoc(recitation) });
});

module.exports = { getDashboard, submitRecitation };
