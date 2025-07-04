const Role = require('../models/roles');
const {
	roleValidation,
	updateRolePermissionsValidation,
} = require('../validations/roles.validation');

// Create Role
exports.createRole = async (req, res, next) => {
	const { error } = roleValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });
	try {
		const role = new Role(req.body);
		const savedRole = await role.save();
		return res
			.status(201)
			.json({ message: 'Role created successfully', role: savedRole });
	} catch (err) {
		next(err);
	}
};

// Get All Roles
exports.getRoles = async (req, res, next) => {
	try {
		const roles = await Role.find()
			.populate('permissions')
			.populate('companyId')
			.populate('branchId');
		return res.status(200).json({ message: 'success', data: roles });
	} catch (err) {
		next(err);
	}
};

// Get Role by ID
exports.getRoleById = async (req, res, next) => {
	try {
		const role = await Role.findById(req.params.id)
			.populate('permissions')
			.populate('companyId')
			.populate('branchId');
		if (!role) return res.status(404).json({ message: 'Role not found' });
		return res.status(200).json({ message: 'success', data: role });
	} catch (err) {
		next(err);
	}
};

// Update Role
exports.updateRole = async (req, res, next) => {
	const { error } = roleValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });
	try {
		// Validate and sanitize input
		const { error, value: sanitizedBody } = roleValidation(req.body);
		const updatedRole = await Role.findByIdAndUpdate(
			req.params.id,
			sanitizedBody,
			{
				new: true,
			}
		);
		if (!updatedRole)
			return res.status(404).json({ message: 'Role not found' });
		return res
			.status(200)
			.json({ message: 'Role updated successfully', role: updatedRole });
	} catch (err) {
		next(err);
	}
};

// Delete Role
exports.deleteRole = async (req, res, next) => {
	try {
		const role = await Role.findByIdAndDelete(req.params.id);
		if (!role) return res.status(404).json({ message: 'Role not found' });
		return res.status(200).json({ message: 'Role deleted successfully' });
	} catch (err) {
		next(err);
	}
};

exports.updateRolePermissions = async (req, res, next) => {
	try {
		const { error } = updateRolePermissionsValidation(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const { id } = req.params;
		const { permissionId, action } = req.body;

		const update =
			action === 'add'
				? { $addToSet: { permissions: permissionId } }
				: { $pull: { permissions: permissionId } };

		const updatedRole = await Role.findByIdAndUpdate(id, update, { new: true });

		if (!updatedRole) {
			return res.status(404).json({ message: 'Role not found' });
		}

		return res.status(200).json({
			message: `Permission ${
				action === 'add' ? 'added to' : 'removed from'
			} the role successfully`,
			data: updatedRole,
		});
	} catch (err) {
		next(err); // Pass the error to the common error handler middleware
	}
};
