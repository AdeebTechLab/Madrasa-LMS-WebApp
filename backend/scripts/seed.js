require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectDatabase = require('../src/config/db');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const ClassRoom = require('../src/models/ClassRoom');
const Assignment = require('../src/models/Assignment');
const Recitation = require('../src/models/Recitation');
const Feedback = require('../src/models/Feedback');
const JuzProgress = require('../src/models/JuzProgress');
const Admission = require('../src/models/Admission');

async function ensureUser(payload) {
  const existing = await User.findOne({ email: payload.email }).select('+password');
  if (existing) return existing;
  return User.create(payload);
}

async function run() {
  await connectDatabase();

  const admin = await ensureUser({ fullName: 'Amina Siddiqui', email: 'admin@sakinah.test', password: 'password123', role: 'ADMIN' });
  const teacher = await ensureUser({ fullName: 'Ustadh Hamza Farooq', email: 'teacher@sakinah.test', password: 'password123', role: 'TEACHER' });
  const student = await ensureUser({ fullName: 'Yusuf Ahmed', email: 'student@sakinah.test', password: 'password123', role: 'STUDENT', currentJuz: 1 });
  const studentTwo = await ensureUser({ fullName: 'Maryam Khan', email: 'maryam@sakinah.test', password: 'password123', role: 'STUDENT', currentJuz: 30 });

  const courses = [
    {
      title: 'Noorani Qaida', slug: 'noorani-qaida', level: 'Beginner', duration: '3 to 6 months',
      description: 'Learn Quran reading foundations with correct makharij, joining rules, and gentle daily practice.',
      learningPath: ['Arabic letters', 'Harakat and sukoon', 'Word joining', 'Fluent Qaida reading']
    },
    {
      title: 'Tajweed Essentials', slug: 'tajweed-essentials', level: 'Beginner to Intermediate', duration: '4 to 8 months',
      description: 'Build correct recitation habits through practical Tajweed lessons, repetition, and teacher correction.',
      learningPath: ['Makharij', 'Madd', 'Qalqalah', 'Ghunnah']
    },
    {
      title: 'Complete Hifz Program', slug: 'hifz-program', level: 'Intermediate to Advanced', duration: '24 to 48 months',
      description: 'Structured memorization using Sabaq, Sabqi, and Manzil with visible Juz progress and teacher support.',
      learningPath: ['Daily Sabaq', 'Sabqi revision', 'Manzil planning', 'Juz mastery']
    },
    {
      title: 'Nazra Quran Reading', slug: 'nazra-quran-reading', level: 'All levels', duration: '6 to 12 months',
      description: 'Teacher-led Quran reading that strengthens fluency, adab, confidence, and Tajweed awareness.',
      learningPath: ['Fluency', 'Pauses', 'Teacher listening', 'Consistent revision']
    }
  ];

  const savedCourses = [];
  for (const courseData of courses) {
    const course = await Course.findOneAndUpdate({ slug: courseData.slug }, courseData, { upsert: true, new: true, setDefaultsOnInsert: true });
    savedCourses.push(course);
  }

  let classRoom = await ClassRoom.findOne({ title: 'Hifz A · Morning Circle', teacher: teacher._id });
  if (!classRoom) {
    classRoom = await ClassRoom.create({
      title: 'Hifz A · Morning Circle',
      course: savedCourses.find((course) => course.slug === 'hifz-program')._id,
      teacher: teacher._id,
      students: [student._id, studentTwo._id],
      scheduleDays: 'Monday to Friday',
      startTime: '08:00',
      endTime: '09:00'
    });
  }

  let studentAssignment = await Assignment.findOne({ student: student._id });
  if (!studentAssignment) {
    studentAssignment = await Assignment.create({
      student: student._id,
      teacher: teacher._id,
      classRoom: classRoom._id,
      status: 'ASSIGNED',
      sabaqLesson: {
        title: 'Surah Al-Baqarah · Ayat 1–5',
        reference: '2:1–5',
        content: 'الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
        audioUrl: ''
      },
      sabqiLesson: { title: 'Surah Al-Fatihah · Complete Revision', reference: '1:1–7' },
      manzilLesson: { title: 'Juz 30 · Surah An-Naba to An-Naziat', reference: '78–79' },
      teacherNote: 'Read with steady pace. Listen carefully to the madd in ayah 2.'
    });
  }

  let maryamAssignment = await Assignment.findOne({ student: studentTwo._id });
  if (!maryamAssignment) {
    maryamAssignment = await Assignment.create({
      student: studentTwo._id,
      teacher: teacher._id,
      classRoom: classRoom._id,
      status: 'SUBMITTED',
      sabaqLesson: { title: 'Surah Al-Mulk · Ayat 1–5', reference: '67:1–5', content: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ' },
      sabqiLesson: { title: 'Surah Ya-Sin · Ayat 1–12', reference: '36:1–12' },
      manzilLesson: { title: 'Juz 29 · Selected Revision', reference: '67–77' },
      teacherNote: 'Focus on clear qalqalah and confident waqf.'
    });
  }

  const recitation = await Recitation.findOne({ assignment: maryamAssignment._id });
  if (!recitation) {
    await Recitation.create({
      assignment: maryamAssignment._id,
      student: studentTwo._id,
      note: 'I repeated the first five ayat three times and marked the places where I need teacher guidance.',
      status: 'SUBMITTED'
    });
  }

  const feedback = await Feedback.findOne({ student: student._id });
  if (!feedback) {
    await Feedback.create({
      student: student._id,
      teacher: teacher._id,
      assignment: studentAssignment._id,
      textFeedback: 'MashaAllah, your effort is clear. Repeat ayah 3 slowly and keep the ending of each word steady.',
      tajweedNotes: 'Review madd tabi‘i and notice the qalqalah letters when stopping.',
      score: 82
    });
  }

  for (let juzNumber = 1; juzNumber <= 30; juzNumber += 1) {
    const update = juzNumber === 1
      ? { completionPercentage: 36, masteryStatus: 'IN_PROGRESS' }
      : juzNumber === 30
        ? { completionPercentage: 100, masteryStatus: 'MASTERED' }
        : { completionPercentage: 0, masteryStatus: 'NOT_STARTED' };
    await JuzProgress.updateOne({ student: student._id, juzNumber }, { $set: update }, { upsert: true });
  }

  if (!(await Admission.exists({ email: 'sarah.khan@example.test' }))) {
    await Admission.create({
      studentName: 'Maryam Khan', parentName: 'Sarah Khan', email: 'sarah.khan@example.test', phone: '+92 300 0000000',
      courseInterest: 'Noorani Qaida', currentLevel: 'Can recognise Arabic letters',
      message: 'We would like a calm, teacher-led foundation program.', status: 'PENDING'
    });
  }

  console.log('\nSeed complete. Demo login credentials:');
  console.log('Admin   admin@sakinah.test / password123');
  console.log('Teacher teacher@sakinah.test / password123');
  console.log('Student student@sakinah.test / password123\n');
  await require('mongoose').connection.close();
  process.exit(0);
}

run().catch(async (error) => {
  console.error('Seed failed:', error);
  await require('mongoose').connection.close().catch(() => {});
  process.exit(1);
});
