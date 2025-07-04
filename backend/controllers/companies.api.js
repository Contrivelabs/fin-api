const Company = require('../models/companies');
const users = require('../models/users');
const { companyValidation } = require('../validations/companies.validation');
const mongoose = require('mongoose');

// Create a company
const createCompany = async (req, res, next) => {
	const { error } = companyValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	try {
		const company = new Company(req.body);
		const savedCompany = await company.save();
		return res
			.status(201)
			.json({ message: 'Company created successfully', data: savedCompany });
	} catch (err) {
		next(err);
	}
};

// Read all companies
const getCompanies = async (req, res, next) => {
	try {
		const companies = await Company.find();
		return res.status(200).json({ message: 'success', data: companies });
	} catch (err) {
		next(err);
	}
};

// Read a specific company
const getCompanyById = async (req, res, next) => {
	try {
		const company = await Company.findById(req.params.id);
		if (!company) return res.status(404).json({ message: 'Company not found' });
		return res.status(200).json({ message: 'success', data: company });
	} catch (err) {
		next(err);
	}
};

// Update a company
const updateCompany = async (req, res, next) => {
	const { error } = companyValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	try {
		// Validate and sanitize input
		const { error, value: sanitizedBody } = companyValidation(req.body);
		const company = await Company.findByIdAndUpdate(
			req.params.id,
			sanitizedBody,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!company) return res.status(404).json({ message: 'Company not found' });
		return res
			.status(200)
			.json({ message: 'Company updated successfully', data: company });
	} catch (err) {
		next(err);
	}
};

// Delete a company
const deleteCompany = async (req, res, next) => {
	try {
		const company = await Company.findByIdAndDelete(req.params.id);
		if (!company) return res.status(404).json({ message: 'Company not found' });
		return res.status(200).json({ message: 'Company deleted successfully' });
	} catch (err) {
		next(err);
	}
};

const getCompaniesByUserId = async (req, res, next) => {
	try {

		//Write the aggregation query to get each company with its Role Collection
		console.log('Request body: getCompaniesByUserId', req.body);
		//const companies = await Company.find({ userId: req.body.userId, activeStatus: true });
		
		let userId = new mongoose.Types.ObjectId(req.body.userId);
		const companies =  await Company.aggregate([
					{
						$match: {
							userId: userId,
							activeStatus: true
						}
					},
					{
						$lookup: {
							from: "roles", // collection name (lowercase plural usually)
							let: { companyId: "$_id" },
							pipeline:[
							{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$companyId", "$$companyId"] },
										{ $in: ["$roleType", ["staff", "owner", "customer"]] }
									]
								}
							}
						},
						{
							$project: {
									createdAt: 0,
									updatedAt: 0
							}
						}
					],
							as: 'roleList'
						}	
					},
					{
							$project: {
								name: 1,
								roleList: 1,
								_id: 1,
								userId: 1,
							}
					}
		]);

		if (!companies || companies.length === 0) {
			return res.status(404).json({ message: 'No companies found for this user' });
		}
		console.log('New Company List:', companies);
		return res.status(200).json({ message: 'success', data: companies });
	} catch (err) {
		next(err);
	}
};


module.exports = {
	createCompany,
	getCompanies,
	getCompanyById,
	updateCompany,
	deleteCompany,
	getCompaniesByUserId
};
