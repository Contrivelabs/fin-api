const mongoose = require('mongoose');
const Branch = require('../models/branches');
const branchValidation = require('../validations/branches.validation');

// Create a Branch
const createBranch = async (req, res, next) => {
	try {
		const { error } = branchValidation(req.body);
		if (error)
			return res.status(400).json({ message: error.details[0].message });

		if (!mongoose.Types.ObjectId.isValid(req.body['companyId'])) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [
					`Invalid ObjectId: '${req.body['companyId']}' for field 'companyId'`,
				],
			});
		}

		const branch = new Branch(req.body);
		await branch.save();
		return res
			.status(201)
			.json({ message: 'Branch created successfully', data: branch });
	} catch (err) {
		next(err);
	}
};

// Get All Branches
const getAllBranches = async (req, res, next) => {
	try {
		const branches = await Branch.find();
		return res.status(200).json({ message: 'success', data: branches });
	} catch (err) {
		next(err);
	}
};

// Get Branch by ID
const getBranchById = async (req, res, next) => {
	try {
		const branchId = req.params.id;
		// Check if the provided ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(branchId)) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [`Invalid ObjectId: '${branchId}'`],
			});
		}
		// Find the branch by ID
		const branch = await Branch.findById(branchId);
		// If the branch is not found, return a 404 with a meaningful message
		if (!branch) {
			return res.status(404).json({ message: 'Branch not found' });
		}
		return res.status(200).json({ message: 'success', data: branch });
	} catch (err) {
		next(err);
	}
};

// Update a Branch
const updateBranch = async (req, res, next) => {
	const { error } = branchValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });
	try {
		// Validate and sanitize input
		const { error, value: sanitizedBody } = branchValidation(req.body);
		const branch = await Branch.findByIdAndUpdate(
			req.params.id,
			sanitizedBody,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!branch) return res.status(404).json({ message: 'Branch not found' });
		return res
			.status(200)
			.json({ message: 'Branch updated successfully', data: branch });
	} catch (err) {
		next(err);
	}
};

// Delete a Branch
const deleteBranch = async (req, res, next) => {
	try {
		const branch = await Branch.findByIdAndDelete(req.params.id);
		if (!branch) return res.status(404).json({ message: 'Branch not found' });
		return res.status(200).json({ message: 'Branch deleted successfully' });
	} catch (err) {
		next(err);
	}
};

//Get Branches by Company ID
const getBranchesByCompanyId = async (req, res, next) => {
	try {
		console.log('Request body: getBranchesByCompanyId', req.body);
		const companyId = req.body.companyId;
		if (!mongoose.Types.ObjectId.isValid(companyId)) {
			return res.status(400).json({
				message: 'Validation error',
				errors: [`Invalid ObjectId: '${companyId}' for field 'companyId'`],
			});
		}
		const branches = await Branch.find({ companyId, activeStatus: true });
		if (branches.length === 0) {
			return res.status(404).json({ message: 'No branches found for this company' });
		}
		return res.status(200).json({ message: 'success', data: branches });
	}
	catch (err) {
		next(err);
	}
}
// Export the functions for use in routes

module.exports = {
	createBranch,
	getAllBranches,
	getBranchById,
	updateBranch,
	deleteBranch,
	getBranchesByCompanyId
};
