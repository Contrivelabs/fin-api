const Joi = require('joi');

const roleValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(100).required().messages({
			'string.base': 'Role name must be a string',
			'string.empty': 'Role name is required',
			'string.min': 'Role name must be at least 3 characters long',
			'string.max': 'Role name must be at most 100 characters long',
		}),
		permissions: Joi.array()
			.items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
			.min(1)
			.required()
			.messages({
				'string.pattern.base': 'Invalid Permission ID',
				'array.base': 'Permissions must be an array',
				'array.min':
					'Permissions must contain at least one valid permission ID',
			}),
		companyId: Joi.string()
			.pattern(/^[0-9a-fA-F]{24}$/)
			.required()
			.messages({
				'string.empty': 'Company ID is required',
				'string.pattern.base': 'Invalid Company ID',
			}),
		branchId: Joi.string()
			.pattern(/^[0-9a-fA-F]{24}$/)
			.allow(null)
			.messages({
				'string.pattern.base': 'Invalid Branch ID',
			}),
		appliesToAllBranches: Joi.boolean().messages({
			'boolean.base': 'Applies to all branches must be true or false',
		}),
		activeStatus: Joi.boolean().messages({
			'boolean.base': 'Active status must be true or false',
		}),
		default: Joi.boolean().messages({
			'boolean.base': 'Default status must be true or false',
		}),
		type: Joi.string().valid('system', 'custom').default('custom').messages({
			'any.only': 'Type must be either "system" or "custom"',
		}),
		roleType: Joi.string()
			.valid('owner', 'customer', 'staff')
			.default('customer')
			.messages({
				'any.only': 'Role type must be either "owner", "customer", or "staff"',
			}),
		createdAt: Joi.date().default(Date.now).messages({
			'date.base': 'Created at must be a valid date',
		}),
		updatedAt: Joi.date().default(Date.now).messages({
			'date.base': 'Updated at must be a valid date',
		}),
	});

	return schema.validate(data);
};

const updateRolePermissionsValidation = (data) => {
	const schema = Joi.object({
		permissionId: Joi.string()
			.pattern(/^[0-9a-fA-F]{24}$/)
			.required()
			.messages({
				'string.pattern.base': 'Invalid permissionId format',
				'any.required': 'Permission ID is required',
			}),
		action: Joi.string().valid('add', 'remove').required().messages({
			'any.only': 'Action must be either "add" or "remove"',
			'any.required': 'Action is required',
		}),
	});

	return schema.validate(data);
};

module.exports = { roleValidation, updateRolePermissionsValidation };
