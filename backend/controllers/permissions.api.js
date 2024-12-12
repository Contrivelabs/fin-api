const Permission = require('../models/permissions');
const {
	permissionValidation,
} = require('../validations/permissions.validation');

// Create Permission
const createPermission = async (req, res, next) => {
	const { error } = permissionValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });
	try {
		const permission = new Permission(req.body);
		const savedPermission = await permission.save();
		return res.status(201).json({
			message: 'Permission created successfully',
			data: savedPermission,
		});
	} catch (err) {
		next(err);
	}
};

// Get All Permissions
const getPermissions = async (req, res, next) => {
	try {
		const permissions = await Permission.find(
			{ activeStatus: true },
			{ name: 1, groupName: 1, description: 1, _id: 1 }
		);
		return res.status(200).json({ message: 'Success', data: permissions });
	} catch (err) {
		next(err);
	}
};

// Get Permission by ID
const getPermissionById = async (req, res, next) => {
	try {
		const permission = await Permission.findById(req.params.id, {
			name: 1,
			groupName: 1,
			description: 1,
			_id: 1,
		});
		if (!permission) {
			return res.status(404).json({ message: 'Permission not found' });
		}
		return res.status(200).json({ message: 'Success', data: permission });
	} catch (err) {
		next(err);
	}
};

// Update Permission
const updatePermission = async (req, res, next) => {
	try {
		const { error } = permissionValidation(req.body);
		if (error) {
			return res.status(400).json({
				message: 'Validation error',
				errors: error.details.map((e) => e.message),
			});
		}

		const permission = await Permission.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!permission) {
			return res.status(404).json({ message: 'Permission not found' });
		}

		return res
			.status(200)
			.json({ message: 'Permission updated successfully', data: permission });
	} catch (err) {
		next(err);
	}
};

// Delete Permission
const deletePermission = async (req, res, next) => {
	try {
		const permission = await Permission.findByIdAndDelete(req.params.id);
		if (!permission) {
			return res.status(404).json({ message: 'Permission not found' });
		}

		return res.status(200).json({ message: 'Permission deleted successfully' });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createPermission,
	getPermissions,
	getPermissionById,
	updatePermission,
	deletePermission,
};
