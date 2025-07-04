const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Branch name is required'],
		minlength: 3,
		maxlength: 100,
	}, // Branch name (e.g., "Bangalore Branch")
	address: {
		type: String,
		required: [false, 'Branch address is required'],
		minlength: 10,
		maxlength: 255,
	}, // Full address of the branch
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User ID is required'],
		validate: {
			validator: function (v) {
				return mongoose.Types.ObjectId.isValid(v);
			},
			message: (props) =>
				`'${props.value}' is not a valid ObjectId for field '${props.path}'`,
		}
	}, // Reference to the company
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: [true, 'Company ID is required'],
		validate: {
			validator: function (v) {
				return mongoose.Types.ObjectId.isValid(v);
			},
			message: (props) =>
				`'${props.value}' is not a valid ObjectId for field '${props.path}'`,
		}
	}, // Reference to the company
	email: {
		type: String,
		validate: {
			validator: function (v) {
				return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
			},
			message: 'Please provide a valid email address',
		},
	},
	phone: {
		type: String,
		validate: {
			validator: function (v) {
				return /^[0-9]{10}$/.test(v); // Ensure it's a 10-digit number
			},
			message: 'Phone number must be a 10-digit number',
		},
	},
	default: {
		type: Boolean,
		default: false,
	},
	activeStatus: {
		type: Boolean,
		default: true,
	}, // Whether the branch is active or inactive
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

branchSchema.pre('findOneAndUpdate', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

branchSchema.pre('updateOne', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

module.exports = mongoose.model('Branch', branchSchema);
