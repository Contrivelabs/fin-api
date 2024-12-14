const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Role name is required'],
		minlength: [3, 'Role name must be at least 3 characters long'],
		maxlength: [100, 'Role name must be at most 100 characters long'],
	},
	permissions: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Permission',
			},
		],
		validate: {
			validator: function (v) {
				return v && v.length > 0; // Ensure it's an array with at least one element
			},
			message: 'Permissions must contain at least one valid permission ID',
		},
	},
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: [true, 'Company ID is required'],
	},
	branchId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Branch',
		default: null,
	},
	appliesToAllBranches: {
		type: Boolean,
		default: false,
	},
	activeStatus: {
		type: Boolean,
		default: true,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the `updatedAt` timestamp
roleSchema.pre('findOneAndUpdate', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

roleSchema.pre('updateOne', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

module.exports = mongoose.model('Role', roleSchema);
