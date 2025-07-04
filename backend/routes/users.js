const express = require('express');
const router = express.Router();
const {
	createUser,
	deleteSignUpUser,
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
	otpverify,
	resendOTP
} = require('../controllers/users.api');

// Routes
router.post('/', createUser);
router.post('/delete-signup-user', deleteSignUpUser);
router.post('/otpverify', otpverify);
router.post('/resend-otp', resendOTP);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
