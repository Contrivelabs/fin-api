const mongoose = require('mongoose');
const User = require('../models/users');
const Company = require('../models/companies');
const Branch = require('../models/branches');
const Role = require('../models/roles');
const Permission = require('../models/permissions');
const { validateUser, validateSignUpUser, validateUserOTP, validateUserResendOTP, validateSignInUser } = require('../validations/users.validation');
const { ErrorResponse } = require('../middlewares/errorHandler');
const { companyValidation } = require('../validations/companies.validation');
const { branchValidation } = require('../validations/branches.validation');
const tokenService = require('../utils/tokenService');
const audit = require('../utils/auditLogger');
const { roleValidation } = require('../validations/roles.validation');

const issueTokens = async (user) => {
  const accessToken = tokenService.createToken({ id: user._id }, '15m'); //, role: user.role
  const refreshToken = tokenService.createToken({ id: user._id }, '7d'); //, role: user.role
  const hashedRefresh = tokenService.hashToken(refreshToken);
  user.refreshToken = hashedRefresh;
  await user.save();
  audit.log('TOKEN_ISSUED', { userId: user._id });
  return { accessToken, refreshToken };
};

// Create User
exports.createUser = async (req, res, next) => {
	// Validate Request Body
	let err = null;
	let companyName = null;
	let savedUser = null;
	let savedCompany = null;
	let savedBranch = null;
	if('from' in req.body && req.body.from === 'sign-up'){ 
		companyName = req.body.companyName || '';
		let reqBody = req.body;
		delete reqBody['companyName'];
		delete reqBody['from'];
		err  = validateSignUpUser(reqBody);

	}else{
 		err  = validateUser(req.body);
	}
	const { error } = err;
	if (error) {
		console.error('Validation error:', error['details']);
		return res.status(400).json({ message: error.details[0].message });
	}
	try {
		/*if (!mongoose.Types.ObjectId.isValid(req.body['companyId'])) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [
					`Invalid ObjectId: '${req.body['companyId']}' for field 'companyId'`,
				],
			});
		}*/
		
		const user = new User(req.body);
		user.generateOTP();
		savedUser = await user.save();
		let companyObject = { name: companyName, userId: String(savedUser._id) }
		const companyError = await companyValidation(companyObject);
		if (companyError.error) {
			const user = await User.findByIdAndDelete(savedUser._id);
			console.log('User deleted due to company validation error:', user);
			return res.status(400).json({ message: companyError.error.details[0].message });
		}
		const company = new Company(companyObject);
		savedCompany = await company.save();
		let branchObject = {
			name: 'Head Office',
			userId: String(savedUser._id),
			companyId: String(savedCompany._id),
			default: true,
		};
		const branchError = await branchValidation(branchObject);
		if (branchError.error) {
			const user = await User.findByIdAndDelete(savedUser._id);
			const company = await Company.findByIdAndDelete(savedCompany._id);
			console.log('User and Company deleted due to branch validation error:', user, company);
			return res.status(400).json({ message: branchError.error.details[0].message });
		}
		const branch = new Branch(branchObject);
		savedBranch = await branch.save();
		let newObject = {
			name: savedUser.name,
			primaryPhoneNo: savedUser.primaryPhoneNo,
			_id: String(savedUser._id),
			companyId: String(savedCompany._id),
			branchId: String(savedBranch._id)
		}
		const permissions = await Permission.find({ activeStatus: true });
		//collect all permission IDs
		const permissionIds = permissions.map(permission => String(permission._id));
		const permissionIdsForStaffCollector = permissions.map(permission => {
			if (permission.name === 'Collect Loans' || permission.name === 'View Close Loans')
				return String(permission._id);
			return null;
		}).filter(id => id !== null);
		const permissionIdsforCustomer = permissions.map(permission => {
			if (permission.name === 'Customer Access')
				return String(permission._id);
			return null;
		}).filter(id => id !== null);

		let roleObject = {
			name: 'Owner',
			permissions: permissionIds,
			companyId: String(savedCompany._id),
			branchId: String(savedBranch._id),
			appliesToAllBranches: true,
			default: true,
			type: 'system',
			roleType: 'owner',
		}
		let staffRoleObject = {
			name: 'Staff',
			permissions: permissionIdsForStaffCollector,
			companyId: String(savedCompany._id),
			branchId: String(savedBranch._id),
			appliesToAllBranches: true,
			default: true,
			type: 'system',
			roleType: 'staff',
		}
		let customerRoleObject = {
			name: 'Customer',
			permissions: permissionIdsforCustomer,
			companyId: String(savedCompany._id),
			branchId: String(savedBranch._id),
			appliesToAllBranches: true,
			default: true,
			type: 'system',
			roleType: 'customer',
		}
		const roleError = await roleValidation(roleObject);
		const staffRoleError = await roleValidation(staffRoleObject);
		const customerRoleError = await roleValidation(customerRoleObject);
		if (roleError.error || staffRoleError.error || customerRoleError.error) {
			const user = await User.findByIdAndDelete(savedUser._id);
			const company = await Company.findByIdAndDelete(savedCompany._id);
			const branch = await Branch.findByIdAndDelete(savedBranch._id);
			console.log('User, Company, and Branch deleted due to role validation error:', user, company, branch);
			return res.status(400).json({ message: roleError.error.details[0].message || staffRoleError.error.details[0].message || customerRoleError.error.details[0].message });
		}
		const role = new Role(roleObject);
		await role.save();
		const staffRole = new Role(staffRoleObject);
		await staffRole.save();
		const customerRole = new Role(customerRoleObject);
		await customerRole.save();
		newObject.ownerRoleId = String(role._id);
		newObject.staffRoleId = String(staffRole._id);
		newObject.customerRoleId = String(customerRole._id);
		console.log('Saved User:', newObject);
		return res
			.status(201)
			.json({ message: 'User created successfully', data: newObject });
	} catch (err) {
		if(savedUser)
			await User.findByIdAndDelete(savedUser._id);
		if(savedCompany)
			await Company.findByIdAndDelete(savedCompany._id);
		if(savedBranch)
			await Branch.findByIdAndDelete(savedBranch._id);
		next(err);
	}
};

exports.deleteSignUpUser = async (req, res, next) => {
	try {
		const userId = req.body.userId;
		const companyId = req.body.companyId;
		const branchId = req.body.branchId;
		const ownerRoleId = req.body.ownerRoleId;
		const staffRoleId = req.body.staffRoleId;
		const customerRoleId = req.body.customerRoleId;
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [`Invalid ObjectId: '${userId}'`],
			});
		}
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		const company = await Company.findByIdAndDelete(companyId);	
		if (!company) {
			return res.status(404).json({ message: 'Company not found' });
		}
		const branch = await Branch.findByIdAndDelete(branchId);
		if (!branch) {
			return res.status(404).json({ message: 'Branch not found' });
		}
		const ownerRole = await Role.findByIdAndDelete(ownerRoleId);
		if (!ownerRole) {
			return res.status(404).json({ message: 'Owner Role not found' });
		}
		const staffRole = await Role.findByIdAndDelete(staffRoleId);
		if (!staffRole) {
			return res.status(404).json({ message: 'Staff Role not found' });
		}
		const customerRole = await Role.findByIdAndDelete(customerRoleId);
		if (!customerRole) {
			return res.status(404).json({ message: 'Customer Role not found' });
		}
		return res.status(200).json({
			success: true,
			message: 'User, Company, and Branch deleted successfully',
		});
	} catch (err) {
		next(err);
	}
}

exports.otpverify = async (req, res, next) => {
	// Validate Request Body
	const { error } = validateUserOTP(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	try {
		const userId = req.body.userId;
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [`Invalid ObjectId: '${userId}'`],
			});
		}
		const user = await User.findById(userId, {name: 1, primaryPhoneNo: 1, otp: 1, otpExpireDateTime: 1, _id:1});
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		if (user.otp !== req.body.otp) {
			return res.status(400).json({ message: 'Invalid OTP' });
		}
		if (Date.now() > user.otpExpireDateTime) {
			return res.status(400).json({ message: 'OTP has expired' });
		}
		user.otp = null; // Clear OTP after successful verification
		user.otpExpireDateTime = null; // Clear OTP expiration time
		const tokens = await issueTokens(user);
		await user.save();
		console.log({ message: 'OTP verified successfully', data: user, ...tokens });
		return res.status(200).json({ message: 'OTP verified successfully', data: user, ...tokens });
	} catch (err) {
		next(err);
	}
}

exports.resendOTP = async (req, res, next) => {
	console.log('Resend OTP request body:', req.body);
	let  err = null;
	if('from' in req.body && req.body.from === 'sign-in') {
		err = validateSignInUser(req.body);
	} else {
		err = validateUserResendOTP(req.body);
	}
	const { error } = err;
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	try {
		let user = null;
		if('from' in req.body && req.body.from === 'sign-in') {
			const primaryPhoneNo = req.body.primaryPhoneNo;
			if (!primaryPhoneNo || !/^[0-9]{10}$/.test(primaryPhoneNo)) {
				return res.status(400).json({
					message: 'Validation error',
					errors: ['Primary phone number must be a 10-digit number.'],
				});
			}
			user = await User.findOne({ primaryPhoneNo: primaryPhoneNo });
		}else{
			const userId = req.body.userId;
			if (!mongoose.Types.ObjectId.isValid(userId)) {
				return res.status(400).json({
					message: 'Validation error',
					errors: [`Invalid ObjectId: '${userId}'`],
				});
			}
			user = await User.findById(userId);
		}

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		user.generateOTP(); // Regenerate OTP
		await user.save();
		return res.status(200).json({ message: 'OTP resent successfully', data: user });
	} catch (err) {
		next(err);
	}
}

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    const payload = tokenService.verifyToken(refreshToken);
    const hashed = tokenService.hashToken(refreshToken);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== hashed) {
      audit.log('REFRESH_FAIL', { userId: payload.id });
      return res.status(403).json({ message: 'Refresh token mismatch' });
    }
    const tokens = await issueTokens(user);
    audit.log('REFRESH_SUCCESS', { userId: user._id });
    res.status(200).json(tokens);
  } catch (err) {
    audit.log('REFRESH_ERROR', { error: err.message });
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Get All Users
exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find();
		return res
			.status(200)
			.json({ success: true, message: 'success', data: users });
	} catch (err) {
		next(err);
	}
};

// Get User by ID
exports.getUserById = async (req, res, next) => {
	try {
		const userId = req.params.id;
		// Check if the provided ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [`Invalid ObjectId: '${userId}'`],
			});
		}
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.status(200).json({ message: 'success', data: user });
	} catch (err) {
		next(err);
	}
};

// Update User
exports.updateUser = async (req, res, next) => {
	// Validate Request Body
	const { error } = validateUser(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	try {
		// Validate and sanitize input
		const { error, value: sanitizedBody } = validateUser(req.body);

		const user = await User.findByIdAndUpdate(req.params.id, sanitizedBody, {
			new: true,
			runValidators: true,
		});
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res
			.status(200)
			.json({ message: 'Branch updated successfully', data: user });
	} catch (err) {
		next(err);
	}
};

// Delete User
exports.deleteUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.status(200).json({
			success: true,
			message: 'User deleted successfully',
		});
	} catch (err) {
		next(err);
	}
};
