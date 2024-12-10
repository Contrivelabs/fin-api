const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
	name: { type: String, required: true }, // Role name (e.g., "Admin", "Manager", "Collector")
	permissions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Permission',
		},
	], // List of permissions associated with the role
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	}, // Reference to the company to which the role belongs
	branchId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Branch',
		default: null,
	}, // Null if the role applies to all branches
	appliesToAllBranches: {
		type: Boolean,
		default: false,
	}, // Indicates whether the role applies to all branches or a specific branch
	activeStatus: {
		type: Boolean,
		default: true, // Default to active
	}, // Status of the role (true = active, false = inactive)
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Role', roleSchema);
