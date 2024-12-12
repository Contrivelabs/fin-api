const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		required: [true, 'Name is required'],
		minlength: [3, 'Name must be at least 3 characters long'],
		maxlength: [100, 'Name must not exceed 100 characters'],
	}, // Name of the permission (e.g., "view-loan", "create-customer")
	groupName: {
		type: String,
		required: true,
		required: [true, 'Group name is required'],
		minlength: [3, 'Group name must be at least 3 characters long'],
		maxlength: [100, 'Group name must not exceed 100 characters'],
	}, // Name of the permission (e.g., "Customer Management", "Loan Management")
	description: {
		type: String,
		minlength: [3, 'Description must be at least 3 characters long'],
		maxlength: [255, 'Description must not exceed 255 characters'],
	}, // A short description of what the permission allows
	activeStatus: {
		type: Boolean,
		default: true, // Default to active
	}, // Status of the permission (true = active, false = inactive)
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

permissionSchema.pre('findOneAndUpdate', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

permissionSchema.pre('updateOne', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

module.exports = mongoose.model('Permission', permissionSchema);
