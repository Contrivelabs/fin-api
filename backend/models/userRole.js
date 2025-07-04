const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'Role ID is required'],
    validate: {
      validator: function (v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: (props) =>
        `'${props.value}' is not a valid ObjectId for field '${props.path}'`,
    },
  },
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  activeStatus: {
    type: Boolean,
    default: true,
  },
});   

// Pre-save hook to update the `updatedAt` field
userRoleSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
}); 

// Pre-update hook to update the `updatedAt` field
userRoleSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});   

userRoleSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});   

const UserRole = mongoose.model('UserRole', userRoleSchema);