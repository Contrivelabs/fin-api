const Company = require('../models/companies');
const { companyValidation } = require('../validations/companies.validation');

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
		return res.status(200).json({ message: 'Success', data: companies });
	} catch (err) {
		next(err);
	}
};

// Read a specific company
const getCompanyById = async (req, res, next) => {
	try {
		const company = await Company.findById(req.params.id);
		if (!company) return res.status(404).json({ message: 'Company not found' });
		return res.status(200).json({ message: 'Success', data: company });
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

module.exports = {
	createCompany,
	getCompanies,
	getCompanyById,
	updateCompany,
	deleteCompany,
};
