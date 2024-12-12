const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		minlength: 3,
		maxlength: 100,
	},
	companyName: {
		type: String,
		required: [true, 'Company name is required'],
		minlength: 3,
		maxlength: 100,
	},
	address: {
		type: String,
		required: [true, 'Company address is required'],
		minlength: 10,
		maxlength: 255,
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		validate: {
			validator: function (v) {
				return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
			},
			message: 'Please provide a valid email address',
		},
	},
	phone: {
		type: String,
		required: [true, 'Phone number is required'],
		unique: true,
		validate: {
			validator: function (v) {
				return /^[0-9]{10}$/.test(v); // Ensure it's a 10-digit number
			},
			message: 'Phone number must be a 10-digit number',
		},
	},
	activeStatus: {
		type: Boolean,
		default: true, // Default to active
	}, // Status of the company (true = active, false = inactive)
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

companySchema.index({ email: 1 }, { unique: true });
companySchema.index({ phone: 1 }, { unique: true });

companySchema.pre('findOneAndUpdate', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

companySchema.pre('updateOne', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

const Company = mongoose.model('Company', companySchema);

// Manually trigger index creation if needed (e.g., in a development environment)
Company.syncIndexes()
	.then(() => console.log('Indexes created or updated successfully'))
	.catch((err) => console.error('Error creating indexes:', err));

module.exports = Company;
