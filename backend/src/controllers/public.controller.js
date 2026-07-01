const Course = require('../models/Course');
const Admission = require('../models/Admission');
const asyncHandler = require('../utils/asyncHandler');
const { serializeList, serializeDoc } = require('../utils/serialize');

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isPublished: true }).sort({ createdAt: 1 }).lean();
  res.json({ courses: serializeList(courses) });
});

const createAdmission = asyncHandler(async (req, res) => {
  const fields = ['studentName', 'parentName', 'email', 'phone', 'courseInterest'];
  const missing = fields.filter((field) => !String(req.body[field] || '').trim());
  if (missing.length) return res.status(400).json({ message: `Please complete: ${missing.join(', ')}.` });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(req.body.email).trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const admission = await Admission.create({
    studentName: req.body.studentName,
    parentName: req.body.parentName,
    email: req.body.email,
    phone: req.body.phone,
    courseInterest: req.body.courseInterest,
    currentLevel: req.body.currentLevel,
    message: req.body.message
  });

  res.status(201).json({ message: 'Admission request submitted successfully.', admission: serializeDoc(admission) });
});

module.exports = { getCourses, createAdmission };
