const UserRole = require('../models/userRole');
const mongoose = require('mongoose');
const userRoleValidation = require('../validations/userRole.validation');

// Create User Role
exports.createUserRole = async (req, res, next) => {
  try {
    // Validate the request body
    const { error } = userRoleValidation.validateUserRole(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { roleId, userId, companyId } = req.body;

    if (!roleId || !userId || !companyId) {
      return res.status(400).json({ message: 'roleId, userId, and companyId are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(roleId) || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: 'Validation error',
        errors: [
          `Invalid ObjectId for roleId: '${roleId}', userId: '${userId}', or companyId: '${companyId}'`
        ],
      });
    }

    const userRole = new UserRole(req.body);
    await userRole.save();
    return res.status(201).json({ message: 'User role created successfully', data: userRole });
  } catch (err) {
    next(err);
  }
}
