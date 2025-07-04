const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [100, 'Name must not exceed 100 characters'],
  },
  email: {
    type: String,
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  activeStatus: { type: Boolean, default: true },
  roleId: {
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
    },
  }, // Reference to the company
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    validate: {
      validator: function (v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: (props) =>
        `'${props.value}' is not a valid ObjectId for field '${props.path}'`,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId
  },
});

// Pre-save hook to update the `updatedAt` field
customerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

customerSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

customerSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Customer', customerSchema);