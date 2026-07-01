const router = require('express').Router();
const { requireAuth, allowRoles } = require('../middleware/auth');
const { getDashboard, getUsers, updateAdmission } = require('../controllers/admin.controller');

router.use(requireAuth, allowRoles('ADMIN'));
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.patch('/admissions/:admissionId', updateAdmission);

module.exports = router;
