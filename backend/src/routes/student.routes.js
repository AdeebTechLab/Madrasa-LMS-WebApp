const router = require('express').Router();
const { requireAuth, allowRoles } = require('../middleware/auth');
const { getDashboard, submitRecitation } = require('../controllers/student.controller');

router.use(requireAuth, allowRoles('STUDENT'));
router.get('/dashboard', getDashboard);
router.post('/submit-recitation', submitRecitation);

module.exports = router;
