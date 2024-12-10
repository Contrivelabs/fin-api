const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
	loanType: {
		type: String,
		enum: ['personal', 'vehicle', 'other'],
		required: true,
	}, // Type of loan (e.g., personal, vehicle, etc.)
	loanAmount: { type: Number, required: true }, // Total loan amount
	paymentFrequency: {
		type: String,
		enum: ['daily', 'weekly', 'monthly'],
		required: true,
	}, // Payment frequency for installments (e.g., daily, weekly, monthly)
	numOfDues: { type: Number, required: true }, // Number of dues/instalments
	interestRate: { type: Number }, // Interest rate in percentage
	deduction: { type: Number }, // Deduction amount (optional)
	amountIssued: { type: Number, required: true }, // Total amount issued to the customer
	amountIssuedDate: { type: Date, required: true }, // Date when the loan was issued
	dueAmount: { type: Number, required: true }, // Total due amount (including interest)
	firstDueDate: { type: Date, required: true }, // Date for the first installment due
	lastDueDate: { type: Date, required: true }, // Date for the last installment due
	loanIssuedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}, // Reference to the user who issued the loan (typically a staff member)
	collector: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}, // Collector responsible for following up with the customer for repayment
	paymentMethod: {
		type: String,
		enum: ['cash', 'bank', 'online'],
		required: true,
	}, // Payment method for repayments (cash, bank transfer, online)
	guarantorName: { type: String }, // Guarantor's name (optional)
	guarantorPhoneNo: { type: String }, // Guarantor's phone number (optional)
	relationWithGuarantor: { type: String }, // Relationship with the guarantor (optional)
	idVerificationType: {
		type: String,
		enum: ['Aadhar', 'PAN', 'Passport', 'VoterID', 'other'],
	}, // Type of ID used for verification
	idVerificationDocument: {
		type: String,
	}, // Path or URL to the uploaded ID verification document
	guaranteeType: {
		type: String,
		enum: ['personal', 'property', 'vehicle', 'other'],
	}, // Type of guarantee (personal, property, vehicle, etc.)
	guaranteeDocumentType: {
		type: String,
		enum: ['photo', 'scanned', 'online'],
	}, // Document type for the guarantee (photo, scanned copy, or online document)
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	}, // Reference to the company that issued the loan
	branchId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Branch',
	},
	activeStatus: { type: Boolean, default: true }, // Active or inactive status
	createdAt: { type: Date, default: Date.now }, // Record creation date
	updatedAt: { type: Date, default: Date.now }, // Record last updated date
});

module.exports = mongoose.model('Loan', loanSchema);
