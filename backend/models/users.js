const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		minlength: [3, 'Name must be at least 3 characters long'],
		maxlength: [100, 'Name must not exceed 100 characters'],
	},
	email: {
		type: String,
		//unique: true, // Ensures email is unique
		sparse: true, // Allows null values while enforcing uniqueness
		validate: {
			validator: (v) =>
				/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v),
			message: 'Please provide a valid email address',
		},
	},
	primaryPhoneNo: {
		type: String,
		required: [true, 'Primary phone number is required'],
		unique: true, // Ensures primary phone number is unique
		validate: {
			validator: (v) => /^[0-9]{10}$/.test(v),
			message: 'Primary phone number must be a 10-digit number',
		},
	},
	alternatePhoneNo: {
		type: String,
		validate: {
			validator: (v) => !v || /^[0-9]{10}$/.test(v),
			message: 'Alternate phone number must be a 10-digit number',
		},
	},
	city: {
		type: String,
		maxlength: [50, 'City name must be at most 50 characters'],
	},
	collectionRoute: {
		type: String,
		required: [false, 'Collection route is required'],
		minlength: [3, 'Collection route must be at least 3 characters'],
		maxlength: [100, 'Collection route must be at most 100 characters'],
	},
	address: {
		type: String,
		maxlength: [255, 'Address must be at most 255 characters'],
	},
	idType: { type: String },
	idProof: { type: String },
	additionalNotes: {
		type: String,
		maxlength: [500, 'Additional notes must be at most 500 characters'],
	},
	otp: { type: String },
	otpExpireDateTime: { type: Date },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	activeStatus: { type: Boolean, default: true },
	role: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Role',
		validate: {
			validator: function (v) {
				return mongoose.Types.ObjectId.isValid(v);
			},
			message: (props) =>
				`'${props.value}' is not a valid ObjectId for field '${props.path}'`,
		},
	},
	userType: {
		type: String,
		enum: {
			values: ['customer', 'collector'],
			message: "User type must be either 'customer' or 'collector'",
		},
		required: [false, 'User type is required'],
	},
	refreshToken: {
    type: String,
    default: null, // Optional for non-authenticated users
  },
});

// Adding indexes for `email` and `primaryPhoneNo`
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ primaryPhoneNo: 1 }, { unique: true });

// Pre-save hook to update the `updatedAt` field
userSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	next();
});

userSchema.pre('findOneAndUpdate', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

userSchema.pre('updateOne', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});



userSchema.methods.generateJWT = function (id) {
	const payload = {};
	const token = 'FINAPP_USERS';
	const option = {
		expiresIn: '5h',
		issuer: 'contriveLabs.org',
		audience: id,
	};
	return jwt.sign(payload, token, option);
};

userSchema.methods.generateRefreshJWT = function (id) {
	const payload = {};
	const token = 'FINAPP_USER_REFRESH';
	const option = {
		expriesIn: '1y',
		issuer: 'contriveLabs.org',
		audience: id,
	};
	return jwt.sign(payload, token, option);
};

userSchema.methods.generateOTP = function () {
	let otp = otpGenerator.generate(6, {
		alphabets: false,
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
		digits:true
	});
	this.otp = String(otp);
	console.log('GENERATED OTP', this.otp);
	this.otpExpireDateTime = Date.now() + 86400000; // For 24 hour in ms
};

module.exports = mongoose.model('User', userSchema);
