const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: { type: String, required: true }, // Customer name
	email: { type: String, unique: true },
	primaryPhoneNo: { type: String, required: true, unique: true }, // Primary phone number
	alternatePhoneNo: { type: String }, // Alternate phone number (optional)
	city: { type: String }, // Town/City
	collectionRoute: { type: String, required: true }, // Collection route (optional)
	address: { type: String }, // Customer address
	idType: { type: String }, // ID type, e.g., Aadhar, PAN, Passport
	idProof: { type: String }, // Path or URL to the uploaded ID proof
	additionalNotes: { type: String }, // Optional notes about the customer
	otp: { type: String }, // OTP for authentication
	otpExpireDateTime: { type: Date }, // OTP expiration datetime
	createdAt: { type: Date, default: Date.now }, // Record creation date
	updatedAt: { type: Date, default: Date.now }, // Record last updated date
	activeStatus: { type: Boolean, default: true }, // Active or inactive status
	role: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Role',
		required: true,
	}, // Role assigned to this customer
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	}, // Company the customer belongs to
	branchId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Branch',
	},
	userType: {
		type: String,
		enum: ['customer', 'collector'],
		required: true,
	}, // Indicates whether the user is a customer or a collector
});

module.exports = mongoose.model('User', userSchema);
