const { allow } = require('joi');
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  loanId:{
    type: String,
    required: [true, 'Loan ID is required'],
    unique: true,
    maxlength: [20, 'Loan ID cannot exceed 20 characters'],
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
  },
  customLoanId: {
    type: String,
  },
  loanType: {
    type: String,
    enum: ['personal', 'vehicle', 'other'],
    required: [true, 'Loan type is required'],
  },
  loanAmount: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [1, 'Loan amount must be greater than zero'],
  },
  paymentFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: [true, 'Payment frequency is required'],
  },
  numOfDues: {
    type: Number,
    required: [true, 'Number of dues is required'],
    min: [1, 'Number of dues must be at least 1'],
  },
  interestRate: {
    type: Number,
    min: [0, 'Interest rate cannot be negative'],
  },
  deduction: {
    type: Number,
    min: [0, 'Deduction cannot be negative'],
  },
  amountIssued: {
    type: Number,
    required: [true, 'Amount issued is required'],
    min: [1, 'Amount issued must be greater than zero'],
  },
  amountIssuedDate: {
    type: Date,
    required: [true, 'Amount issued date is required'],
  },
  dueAmount: {
    type: Number,
    required: [true, 'Due amount is required'],
    min: [1, 'Due amount must be greater than zero'],
  },
  firstDueDate: {
    type: Date,
    required: [true, 'First due date is required'],
  },
  lastDueDate: {
    type: Date,
    required: [true, 'Last due date is required'],
  },
  loanIssuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Loan issuer is required'],
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Collector is required'],
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'online', '']
  },
  guarantorName: {
    type: String,
    maxlength: [100, 'Guarantor name cannot exceed 100 characters'],
  },
  guarantorPhoneNo: {
    type: String,
    maxlength: [15, 'Guarantor phone number cannot exceed 15 characters'],
  },
  relationWithGuarantor: {
    type: String,
    maxlength: [50, 'Relationship with guarantor cannot exceed 50 characters'],
  },
  guarantorIDType: {
    type: String,
    enum: ['Aadhar', 'PAN', 'Passport', 'VoterID', 'other', ''],
  },
  guarantorUploadIDProof: {
    type: String,
  },
  guaranteeType: {
    type: String,
    allowNull: true,
    enum: ['personal', 'property', 'vehicle', 'other', ''],
  },
  guaranteeDocumentType: {
    type: String,
    enum: ['photo', 'scanned', 'online', ''],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: [true, 'Branch ID is required'],
  },
  activeStatus: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

loanSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

loanSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Loan', loanSchema);
