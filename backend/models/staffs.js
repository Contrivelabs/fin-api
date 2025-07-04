const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [100, 'Name must not exceed 100 characters'],
  },
  email: {
    type: String,
    unique: true, // Ensures email is unique
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
staffSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

staffSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

staffSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Staff', staffSchema);
