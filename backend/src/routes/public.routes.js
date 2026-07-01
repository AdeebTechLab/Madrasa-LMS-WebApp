const router = require('express').Router();
const { getCourses, createAdmission } = require('../controllers/public.controller');

router.get('/courses', getCourses);
router.post('/admissions', createAdmission);

module.exports = router;
