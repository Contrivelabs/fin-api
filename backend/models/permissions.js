const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
	name: { type: String, required: true }, // Name of the permission (e.g., "view-loan", "create-customer")
	description: { type: String }, // A short description of what the permission allows
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	}, // Reference to the company to which the permission belongs
	branchId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Branch',
	},
	activeStatus: {
		type: Boolean,
		default: true, // Default to active
	}, // Status of the permission (true = active, false = inactive)
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Permission', permissionSchema);
