const ClassRoom = require('../models/ClassRoom');
const Assignment = require('../models/Assignment');
const Recitation = require('../models/Recitation');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { serializeDoc, serializeList } = require('../utils/serialize');

const getDashboard = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;
  const classes = await ClassRoom.find({ teacher: teacherId })
    .populate('course', 'title')
    .populate('students', 'fullName email currentJuz')
    .sort({ createdAt: -1 })
    .lean();

  const classIds = classes.map((item) => item._id);
  const [pendingSubmissions, recentFeedback] = await Promise.all([
    Recitation.find({ status: 'SUBMITTED' })
      .populate({ path: 'assignment', match: { teacher: teacherId }, select: 'sabaqLesson sabqiLesson manzilLesson student' })
      .populate('student', 'fullName email')
      .sort({ submittedAt: -1 })
      .lean(),
    Feedback.find({ teacher: teacherId })
      .populate('student', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
  ]);

  const filteredPending = pendingSubmissions.filter((item) => item.assignment);
  const studentIds = classes.flatMap((item) => item.students.map((student) => student._id));
  const recentAssignments = await Assignment.find({ teacher: teacherId, classRoom: { $in: classIds } }).sort({ createdAt: -1 }).limit(8).lean();

  res.json({
    teacher: req.user.toSafeJSON(),
    classes: serializeList(classes),
    pendingSubmissions: serializeList(filteredPending),
    recentFeedback: serializeList(recentFeedback),
    students: serializeList(await User.find({ _id: { $in: studentIds } }).select('fullName email currentJuz').lean()),
    recentAssignments: serializeList(recentAssignments),
    attendanceRate: 94
  });
});

const createAssignment = asyncHandler(async (req, res) => {
  const { studentId, classRoomId, sabaqTitle, sabaqReference, sabaqContent, sabqiTitle, manzilTitle, teacherNote } = req.body;
  if (!studentId || !sabaqTitle || !sabqiTitle || !manzilTitle) {
    return res.status(400).json({ message: 'Student, Sabaq, Sabqi, and Manzil are required.' });
  }

  const student = await User.findOne({ _id: studentId, role: 'STUDENT', isActive: true });
  if (!student) return res.status(404).json({ message: 'Student not found.' });

  const classRoom = classRoomId
    ? await ClassRoom.findOne({ _id: classRoomId, teacher: req.user._id, students: studentId })
    : await ClassRoom.findOne({ teacher: req.user._id, students: studentId });
  if (!classRoom) {
    return res.status(403).json({ message: 'You can only assign lessons to students in your own class.' });
  }

  const assignment = await Assignment.create({
    student: studentId,
    teacher: req.user._id,
    classRoom: classRoom?._id,
    sabaqLesson: { title: sabaqTitle, reference: sabaqReference || '', content: sabaqContent || '' },
    sabqiLesson: { title: sabqiTitle },
    manzilLesson: { title: manzilTitle },
    teacherNote: teacherNote || ''
  });

  res.status(201).json({ message: 'Daily Quran assignment created.', assignment: serializeDoc(assignment) });
});

const sendFeedback = asyncHandler(async (req, res) => {
  const { recitationId, studentId, score, textFeedback, tajweedNotes, voiceFeedbackUrl } = req.body;
  if (!recitationId || !studentId || !String(textFeedback || '').trim()) {
    return res.status(400).json({ message: 'Recitation, student, and written feedback are required.' });
  }

  const recitation = await Recitation.findById(recitationId).populate('assignment');
  if (!recitation || !recitation.assignment || recitation.student.toString() !== studentId || recitation.assignment.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You cannot review this recitation.' });
  }

  const numericScore = Number(score);
  const feedback = await Feedback.create({
    student: studentId,
    teacher: req.user._id,
    assignment: recitation.assignment._id,
    recitation: recitation._id,
    textFeedback,
    tajweedNotes: tajweedNotes || '',
    score: Number.isFinite(numericScore) ? numericScore : undefined,
    voiceFeedbackUrl: voiceFeedbackUrl || ''
  });

  recitation.status = 'REVIEWED';
  await recitation.save();
  recitation.assignment.status = 'REVIEWED';
  await recitation.assignment.save();

  res.status(201).json({ message: 'Feedback sent to the student.', feedback: serializeDoc(feedback) });
});

module.exports = { getDashboard, createAssignment, sendFeedback };
