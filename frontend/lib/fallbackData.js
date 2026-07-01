export const fallbackCourses = [
  { title: 'Noorani Qaida', slug: 'noorani-qaida', level: 'Beginner', duration: '3 to 6 months', description: 'Learn Quran reading foundations with correct makharij and calm practice.' },
  { title: 'Tajweed Essentials', slug: 'tajweed-essentials', level: 'Beginner to Intermediate', duration: '4 to 8 months', description: 'Build correct recitation habits through practical Tajweed lessons and teacher correction.' },
  { title: 'Complete Hifz Program', slug: 'hifz-program', level: 'Intermediate to Advanced', duration: '24 to 48 months', description: 'Structured memorization using Sabaq, Sabqi, and Manzil with progress tracking.' },
  { title: 'Nazra Quran Reading', slug: 'nazra-quran-reading', level: 'All levels', duration: '6 to 12 months', description: 'Teacher-led Quran reading for fluent, confident recitation.' }
];

export const sampleJuzProgress = Array.from({ length: 30 }, (_, index) => ({
  juzNumber: index + 1,
  completionPercentage: index === 0 ? 36 : index === 29 ? 100 : 0,
  masteryStatus: index === 29 ? 'MASTERED' : index === 0 ? 'IN_PROGRESS' : 'NOT_STARTED'
}));
