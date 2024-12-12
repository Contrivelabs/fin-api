const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
	loanId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Loan',
		required: true,
	},
	collectorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}, // Collector responsible for the collection
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
	branchId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Branch',
	},
	paymentMode: { type: String, required: true },
	amountCollected: { type: Number, required: true },
	collectionDate: { type: Date, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

collectionSchema.pre('findOneAndUpdate', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

collectionSchema.pre('updateOne', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

module.exports = mongoose.model('Collection', collectionSchema);
