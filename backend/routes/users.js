const express = require('express');
const router = express.Router();
const {
	createUser,
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
} = require('../controllers/users.api');

// Routes
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
