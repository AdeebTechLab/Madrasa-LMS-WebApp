const router = require('express').Router();
const { requireAuth, allowRoles } = require('../middleware/auth');
const { getDashboard, createAssignment, sendFeedback } = require('../controllers/teacher.controller');

router.use(requireAuth, allowRoles('TEACHER'));
router.get('/dashboard', getDashboard);
router.post('/assignments', createAssignment);
router.post('/feedback', sendFeedback);

module.exports = router;
