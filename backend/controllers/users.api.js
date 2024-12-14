const mongoose = require('mongoose');
const User = require('../models/users');
const { validateUser } = require('../validations/users.validation');
const { ErrorResponse } = require('../middlewares/errorHandler');

// Create User
exports.createUser = async (req, res, next) => {
	// Validate Request Body
	const { error } = validateUser(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	try {
		if (!mongoose.Types.ObjectId.isValid(req.body['companyId'])) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [
					`Invalid ObjectId: '${req.body['companyId']}' for field 'companyId'`,
				],
			});
		}
		const user = new User(req.body);
		const savedUser = await user.save();
		return res
			.status(201)
			.json({ message: 'User created successfully', data: savedUser });
	} catch (err) {
		next(err);
	}
};

// Get All Users
exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find();
		return res
			.status(200)
			.json({ success: true, message: 'Success', data: users });
	} catch (err) {
		next(err);
	}
};

// Get User by ID
exports.getUserById = async (req, res, next) => {
	try {
		const userId = req.params.id;
		// Check if the provided ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [`Invalid ObjectId: '${userId}'`],
			});
		}
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.status(200).json({ message: 'Success', data: user });
	} catch (err) {
		next(err);
	}
};

// Update User
exports.updateUser = async (req, res, next) => {
	// Validate Request Body
	const { error } = validateUser(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	try {
		// Validate and sanitize input
		const { error, value: sanitizedBody } = validateUser(req.body);

		const user = await User.findByIdAndUpdate(req.params.id, sanitizedBody, {
			new: true,
			runValidators: true,
		});
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res
			.status(200)
			.json({ message: 'Branch updated successfully', data: user });
	} catch (err) {
		next(err);
	}
};

// Delete User
exports.deleteUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.status(200).json({
			success: true,
			message: 'User deleted successfully',
		});
	} catch (err) {
		next(err);
	}
};
