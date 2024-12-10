const express = require('express');
const {
	createCompany,
	getCompanies,
	getCompanyById,
	updateCompany,
	deleteCompany,
} = require('../controllers/companies.api');
//const { authMiddleware, roleMiddleware } = require('./auth.middleware');

const router = express.Router();

// Apply authentication middleware
//router.use(authMiddleware);

// CRUD routes with role-based permissions
router.post('/', createCompany); // Only admins can create companies //roleMiddleware(['admin']),
router.get('/', getCompanies); //roleMiddleware(['admin', 'manager']),
router.get('/:id', getCompanyById); //roleMiddleware(['admin', 'manager']),
router.put('/:id', updateCompany); //roleMiddleware(['admin']),
router.delete('/:id', deleteCompany); //roleMiddleware(['admin']),

module.exports = router;
