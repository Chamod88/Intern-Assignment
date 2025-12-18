const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth');

router.post('/', verifyToken, authorizeRoles('employee'), leaveController.createLeave);

router.get('/my-leaves', verifyToken, authorizeRoles('employee'), leaveController.getMyLeaves);

router.get('/all', verifyToken, authorizeRoles('admin'), leaveController.getAllLeaves);

router.put('/:id/status', verifyToken, authorizeRoles('admin'), leaveController.updateLeaveStatus);

module.exports = router;