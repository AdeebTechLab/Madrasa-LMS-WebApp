const Admission = require('../models/Admission');
const Course = require('../models/Course');
const User = require('../models/User');
const ClassRoom = require('../models/ClassRoom');
const asyncHandler = require('../utils/asyncHandler');
const { serializeDoc, serializeList } = require('../utils/serialize');

const getDashboard = asyncHandler(async (req, res) => {
  const [students, teachers, activeCourses, pendingAdmissions, admissions, classes] = await Promise.all([
    User.countDocuments({ role: 'STUDENT', isActive: true }),
    User.countDocuments({ role: 'TEACHER', isActive: true }),
    Course.countDocuments({ isPublished: true }),
    Admission.countDocuments({ status: 'PENDING' }),
    Admission.find().sort({ createdAt: -1 }).limit(8).lean(),
    ClassRoom.find().populate('course', 'title').populate('teacher', 'fullName').sort({ createdAt: -1 }).limit(8).lean()
  ]);

  res.json({
    stats: { students, teachers, activeCourses, pendingAdmissions },
    admissions: serializeList(admissions),
    classes: serializeList(classes)
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('fullName email role currentJuz isActive createdAt').sort({ createdAt: -1 }).lean();
  res.json({ users: serializeList(users) });
});

const updateAdmission = asyncHandler(async (req, res) => {
  const status = String(req.body.status || '').toUpperCase();
  if (!['PENDING', 'CONTACTED', 'APPROVED', 'DECLINED'].includes(status)) {
    return res.status(400).json({ message: 'Choose a valid admission status.' });
  }

  const admission = await Admission.findByIdAndUpdate(req.params.admissionId, { status }, { new: true });
  if (!admission) return res.status(404).json({ message: 'Admission request not found.' });
  res.json({ message: 'Admission status updated.', admission: serializeDoc(admission) });
});

module.exports = { getDashboard, getUsers, updateAdmission };
